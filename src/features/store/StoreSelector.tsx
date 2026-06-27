import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { DataService, type Tienda } from "../../services/DataService";
import { StorePicker } from "./StorePicker";
import { colors } from "../../constants/colors";

type Props = {
  onTiendaSeleccionada: (tienda: Tienda) => void;
};

export function StoreSelector({ onTiendaSeleccionada }: Props) {
  const [pickerVisible, setPickerVisible] = useState(false);
  const tiendas = DataService.getTiendas();

  function handleSelect(tienda: Tienda) {
    setPickerVisible(false);
    onTiendaSeleccionada(tienda);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Sparta</Text>
      <Text style={styles.label}>Tienda</Text>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setPickerVisible(true)}
      >
        <Text style={styles.selectorTexto}>Selecciona una tienda</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
      <StorePicker
        visible={pickerVisible}
        tiendas={tiendas}
        onSelect={handleSelect}
        onClose={() => setPickerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
    backgroundColor: colors.background,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 48,
  },
  label: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 8,
    marginLeft: 4,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  selectorTexto: { fontSize: 16, color: colors.textFaint },
  chevron: { fontSize: 22, color: colors.textFaint },
});
