import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors } from "../../constants/colors";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  DataService,
  type ProductoDetalle,
  type Producto,
} from "../../services/DataService";
import { deduplicarPorEstilo } from "../../utils/productos";
import type { ProductRouteParams } from "../../navigation/types";
import { TallasGrid } from "./TallasGrid";
import { VariantesCarousel } from "./VariantesCarousel";

type Props = NativeStackScreenProps<ProductRouteParams, "Producto">;
type Estado = "cargando" | "no_encontrado" | "sin_datos" | "ok";

export function ProductScreen({ route, navigation }: Props) {
  const { codebar } = route.params;
  const [estado, setEstado] = useState<Estado>("cargando");
  const [detalle, setDetalle] = useState<ProductoDetalle | null>(null);

  useEffect(() => {
    DataService.getProductByBarcode(codebar).then((result) => {
      if (result === null) setEstado("no_encontrado");
      else if (result === "SIN_DATOS") setEstado("sin_datos");
      else {
        setDetalle(result);
        setEstado("ok");
      }
    });
  }, [codebar]);

  function irAProducto(code: string) {
    navigation.replace("Producto", { codebar: code });
  }

  if (estado === "cargando") {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (estado === "no_encontrado") {
    return (
      <View style={styles.centrado}>
        <Text style={styles.mensajeTitulo}>Producto no encontrado</Text>
        <Text style={styles.mensajeSubtitulo}>{codebar}</Text>
      </View>
    );
  }

  if (estado === "sin_datos") {
    return (
      <View style={styles.centrado}>
        <Text style={styles.mensajeTitulo}>Sin datos</Text>
        <Text style={styles.mensajeSubtitulo}>
          Esta tienda no tiene datos disponibles
        </Text>
      </View>
    );
  }

  const { producto, tallas, variantes } = detalle!;
  const colores = deduplicarPorEstilo(variantes);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.volver}
      >
        <Text style={styles.volverTexto}>← Volver</Text>
      </TouchableOpacity>
      <Text style={styles.nombre}>{producto.descripcion}</Text>

      <View style={styles.bloques}>
        <InfoBloque label="Talla" valor={producto.talla} />
        <InfoBloque label="Stock" valor={String(producto.stock)} />
        <InfoBloque
          label="Precio"
          valor={`$${producto.precio.toLocaleString("es-CL")}`}
        />
        <InfoBloque label="Categoría" valor={producto.subcategoria} />
      </View>

      <View style={styles.meta}>
        <Text style={styles.metaTexto}>Estilo: {producto.estilo}</Text>
        <Text style={styles.metaTexto}>Código: {producto.codebar}</Text>
      </View>

      <TallasGrid
        tallas={tallas}
        codigoActivo={producto.codebar}
        onSelect={irAProducto}
      />
      <VariantesCarousel variantes={colores} onSelect={irAProducto} />
    </ScrollView>
  );
}

function InfoBloque({ label, valor }: { label: string; valor: string }) {
  return (
    <View style={styles.infoBloque}>
      <Text style={styles.infoBloqueLabel}>{label}</Text>
      <Text style={styles.infoBloqueValor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 32 },
  centrado: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  mensajeTitulo: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  mensajeSubtitulo: {
    fontSize: 14,
    color: colors.textSubtle,
    textAlign: "center",
  },
  nombre: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    lineHeight: 26,
  },
  bloques: { flexDirection: "row", gap: 12, marginBottom: 12 },
  infoBloque: {
    flex: 1,
    backgroundColor: colors.backgroundCard,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  infoBloqueLabel: { fontSize: 11, color: colors.textMuted, marginBottom: 4 },
  infoBloqueValor: { fontSize: 16, fontWeight: "700" },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  metaTexto: { fontSize: 14, color: colors.textMuted },
  volver: { marginBottom: 12 },
  volverTexto: { fontSize: 14, color: colors.link },
});
