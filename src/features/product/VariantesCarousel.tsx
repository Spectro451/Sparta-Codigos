import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";
import type { Producto } from "../../services/DataService";
import { SectionTitle } from "../../components/SectionTitle";
import { colors } from "../../constants/colors";

type Props = {
  variantes: Producto[];
  onSelect: (codebar: string) => void;
};

export function VariantesCarousel({ variantes, onSelect }: Props) {
  if (variantes.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <SectionTitle>Otros colores</SectionTitle>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.lista}
      >
        {variantes.map((item) => (
          <TouchableOpacity
            key={item.estilo}
            style={styles.card}
            onPress={() => onSelect(item.codebar)}
          >
            <Text style={styles.cardTexto} numberOfLines={3}>
              {item.descripcion}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 24 },
  lista: { paddingBottom: 8, gap: 10 },
  card: {
    width: 140,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    justifyContent: "center",
  },
  cardTexto: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
});
