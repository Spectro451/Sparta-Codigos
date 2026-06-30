import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as XLSX from "xlsx";
import { Platform } from "react-native";
import tiendasData from "../data/tiendas.json";
import { deduplicarPorEstilo } from "../utils/productos";
import {
  EXCEL_URL,
  EXCEL_DATE_KEY,
  EXCEL_ETAG_KEY,
  EXCEL_DATA_KEY,
  CURRENT_TIENDA_KEY,
  SAN_ANTONIO_ID,
} from "../constants/config";
export { SAN_ANTONIO_ID };

const LOCAL_EXCEL_PATH = (FileSystem.documentDirectory ?? "") + "stock.xlsx";

export type Producto = {
  codebar: string;
  descripcion: string;
  talla: string;
  estilo: string;
  marca: string;
  precio: number;
  stock: number;
  subcategoria: string;
};

export type ProductoDetalle = {
  producto: Producto;
  tallas: Producto[];
  variantes: Producto[];
};

export type Tienda = {
  id: string;
  nombre: string;
};

let _productos: Producto[] = [];
let _tiendaCache: Tienda | null | undefined = undefined;

async function _getServerMeta(): Promise<{ etag: string; date: string }> {
  const url =
    Platform.OS === "web" ? `${EXCEL_URL}?t=${Date.now()}` : EXCEL_URL;
  const res = await fetch(url, { method: "HEAD" });
  const lastModified =
    res.headers.get("Last-Modified") ?? new Date().toISOString();
  const date = new Date(lastModified).toISOString().split("T")[0];
  const etag = res.headers.get("ETag") ?? lastModified;
  return { etag, date };
}

function _parseRows(rows: Record<string, unknown>[]): Producto[] {
  return rows.map((row) => ({
    codebar: String(row["CodeBar"] ?? ""),
    descripcion: String(row["Descripcion"] ?? ""),
    talla: String(row["Talla"] ?? ""),
    estilo: String(row["Estilo"] ?? ""),
    marca: String(row["Marca"] ?? "").trim(),
    precio: Number(row["P/Retail"] ?? 0),
    stock: Number(row["Stock"] ?? 0),
    subcategoria: String(row["SubCategoria"] ?? ""),
  }));
}

function _parseWorkbook(workbook: XLSX.WorkBook): void {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  _productos = _parseRows(
    XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet),
  );
}

async function _downloadAndCache(
  onProgress: (pct: number) => void,
): Promise<void> {
  if (Platform.OS === "web") {
    onProgress(50);
    const res = await fetch(`${EXCEL_URL}?t=${Date.now()}`);
    const buffer = await res.arrayBuffer();
    _parseWorkbook(XLSX.read(buffer, { type: "array" }));
  } else {
    const download = FileSystem.createDownloadResumable(
      EXCEL_URL,
      LOCAL_EXCEL_PATH,
      {},
      ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
        onProgress(
          Math.round((totalBytesWritten / totalBytesExpectedToWrite) * 100),
        );
      },
    );
    await download.downloadAsync();
    const content = await FileSystem.readAsStringAsync(LOCAL_EXCEL_PATH, {
      encoding: FileSystem.EncodingType.Base64,
    });
    _parseWorkbook(XLSX.read(content, { type: "base64" }));
  }
  await AsyncStorage.setItem(EXCEL_DATA_KEY, JSON.stringify(_productos));
  onProgress(100);
}

async function _loadFromCache(): Promise<void> {
  const cached = await AsyncStorage.getItem(EXCEL_DATA_KEY);
  _productos = cached ? (JSON.parse(cached) as Producto[]) : [];
}

function _getEstiloBase(estilo: string): string | null {
  const match = estilo.match(/^(.+)[.\-][^.\-]+$/);
  if (!match) return null;
  const base = match[1];
  return base.length >= estilo.length / 2 ? base : null;
}

function _normalizeBarcode(code: string): string {
  return code.replace(/^0+/, "");
}

async function _isSanAntonio(): Promise<boolean> {
  if (_tiendaCache === undefined) {
    const stored = await AsyncStorage.getItem(CURRENT_TIENDA_KEY);
    _tiendaCache = stored ? (JSON.parse(stored) as Tienda) : null;
  }
  return _tiendaCache?.id === SAN_ANTONIO_ID;
}

export const DataService = {
  async initialize(onProgress: (pct: number) => void): Promise<void> {
    try {
      const { etag, date } = await _getServerMeta();
      const localEtag = await AsyncStorage.getItem(EXCEL_ETAG_KEY);
      if (etag !== localEtag) {
        await _downloadAndCache(onProgress);
        await AsyncStorage.setItem(EXCEL_ETAG_KEY, etag);
        await AsyncStorage.setItem(EXCEL_DATE_KEY, date);
        return;
      }
    } catch {}
    await _loadFromCache();
    onProgress(100);
  },

  async getProductByBarcode(
    code: string,
  ): Promise<ProductoDetalle | "SIN_DATOS" | null> {
    if (!(await _isSanAntonio())) return "SIN_DATOS";

    const objetivo = _normalizeBarcode(code);
    if (!objetivo) return null;
    const producto = _productos.find(
      (p) => _normalizeBarcode(p.codebar) === objetivo,
    );
    if (!producto) return null;

    const tallas = _productos.filter((p) => p.estilo === producto.estilo);
    const estiloBase = _getEstiloBase(producto.estilo);
    const variantes = estiloBase
      ? _productos.filter(
          (p) =>
            p.estilo !== producto.estilo &&
            _getEstiloBase(p.estilo) === estiloBase,
        )
      : [];

    return { producto, tallas, variantes };
  },

  async searchByEstilo(query: string): Promise<Producto[]> {
    if (!(await _isSanAntonio())) return [];
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    const filtered = _productos.filter((p) =>
      p.estilo.toLowerCase().includes(q),
    );
    return deduplicarPorEstilo(filtered);
  },

  async getExcelDate(): Promise<string | null> {
    return AsyncStorage.getItem(EXCEL_DATE_KEY);
  },

  getTiendas(): Tienda[] {
    return tiendasData as Tienda[];
  },

  async getCurrentTienda(): Promise<Tienda | null> {
    if (_tiendaCache === undefined) {
      const stored = await AsyncStorage.getItem(CURRENT_TIENDA_KEY);
      _tiendaCache = stored ? (JSON.parse(stored) as Tienda) : null;
    }
    return _tiendaCache;
  },

  async setCurrentTienda(tienda: Tienda): Promise<void> {
    _tiendaCache = tienda;
    await AsyncStorage.setItem(CURRENT_TIENDA_KEY, JSON.stringify(tienda));
  },
};
