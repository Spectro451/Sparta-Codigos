import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";
import type { FilaTalla } from "../../data/tablaTallas";

type Props = {
  datos: FilaTalla[];
};

export function TallasTable({ datos }: Props) {
  return (
    <FlatList
      data={datos}
      keyExtractor={(item) => item.us}
      ListHeaderComponent={<Header />}
      renderItem={({ item, index }) => (
        <Fila item={item} par={index % 2 === 0} />
      )}
    />
  );
}

function Header() {
  return (
    <View style={[styles.fila, styles.header]}>
      <Text style={[styles.celda, styles.headerTexto]}>US</Text>
      <Text style={[styles.celda, styles.headerTexto]}>CM</Text>
      <Text style={[styles.celda, styles.headerTexto]}>Nacional</Text>
    </View>
  );
}

function Fila({ item, par }: { item: FilaTalla; par: boolean }) {
  return (
    <View style={[styles.fila, par && styles.filaPar]}>
      <Text style={styles.celda}>{item.us}</Text>
      <Text style={styles.celda}>{item.cm}</Text>
      <Text style={styles.celda}>{item.nacional}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: "row", paddingVertical: 12, paddingHorizontal: 16 },
  filaPar: { backgroundColor: colors.backgroundStripe },
  header: { backgroundColor: colors.primary, marginBottom: 4 },
  celda: { flex: 1, textAlign: "center", fontSize: 15, color: colors.primary },
  headerTexto: { color: colors.onPrimary, fontWeight: "700", fontSize: 13 },
});
