import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import type { Tienda } from "../../services/DataService";
import { colors } from "../../constants/colors";

type Props = {
  visible: boolean;
  tiendas: Tienda[];
  onSelect: (tienda: Tienda) => void;
  onClose: () => void;
};

export function StorePicker({ visible, tiendas, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={styles.sheet}>
        <Text style={styles.titulo}>Selecciona una tienda</Text>
        <FlatList
          data={tiendas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.opcion}
              onPress={() => onSelect(item)}
            >
              <Text style={styles.opcionTexto}>{item.nombre}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separador} />}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.modalBackdrop },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textMuted,
    marginBottom: 16,
  },
  opcion: { paddingVertical: 16 },
  opcionTexto: { fontSize: 18, color: colors.primary },
  separador: { height: 1, backgroundColor: colors.separator },
});
