import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { Producto } from "../../services/DataService";
import { SectionTitle } from "../../components/SectionTitle";
import { colors } from "../../constants/colors";
import { getStockColor } from "../../utils/productos";

type Props = {
  tallas: Producto[];
  codigoActivo: string;
  onSelect: (codebar: string) => void;
};

export function TallasGrid({ tallas, codigoActivo, onSelect }: Props) {
  if (tallas.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <SectionTitle>Tallas disponibles</SectionTitle>
      <View style={styles.grid}>
        {tallas.map((t) => {
          const activo = t.codebar === codigoActivo;
          const borderColor = activo ? colors.primary : getStockColor(t.stock);
          return (
            <TouchableOpacity
              key={t.codebar}
              style={[
                styles.chip,
                {
                  borderColor,
                  backgroundColor: activo ? colors.primary : colors.background,
                },
              ]}
              onPress={() => !activo && onSelect(t.codebar)}
            >
              <Text style={[styles.talla, activo && styles.textoActivo]}>
                {t.talla}
              </Text>
              <Text style={[styles.stock, activo && styles.textoActivo]}>
                ({t.stock})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 24 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  talla: { fontSize: 14, fontWeight: "600", color: colors.textSecondary },
  stock: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  textoActivo: { color: colors.onPrimary },
});
