import React from "react";
import { Text, StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.titulo}>{children}</Text>;
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 12,
  },
});
