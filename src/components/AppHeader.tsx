import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { DataService, type Tienda } from "../services/DataService";
import { colors } from "../constants/colors";
import { formatExcelDate } from "../constants/dates";

type Props = {
  tienda: Tienda;
  onCambiarTienda: () => void;
};

export function AppHeader({ tienda, onCambiarTienda }: Props) {
  const [fecha, setFecha] = useState<string | null>(null);

  useEffect(() => {
    DataService.getExcelDate().then((d) => {
      if (!d) return;
      setFecha(formatExcelDate(d));
    });
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.nombre}>{tienda.nombre}</Text>
        {fecha && <Text style={styles.fecha}>Stock al {fecha}</Text>}
      </View>
      <TouchableOpacity onPress={onCambiarTienda}>
        <Text style={styles.cambiar}>Cambiar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primary,
  },
  nombre: { color: colors.onPrimary, fontSize: 16, fontWeight: "600" },
  fecha: { color: colors.textMuted, fontSize: 11, marginTop: 1 },
  cambiar: { color: colors.textFaint, fontSize: 14 },
});
