import { colors } from "../constants/colors";

export function deduplicarPorEstilo<T extends { estilo: string }>(
  items: T[],
): T[] {
  const seen = new Set<string>();
  return items.filter((p) => {
    if (seen.has(p.estilo)) return false;
    seen.add(p.estilo);
    return true;
  });
}

export function getStockColor(stock: number): string {
  if (stock === 0) return colors.stockNone;
  if (stock <= 2) return colors.stockLow;
  return colors.stockOk;
}
