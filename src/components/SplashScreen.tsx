import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../constants/colors";

type Props = {
  progress: number;
};

export function SplashScreen({ progress }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sparta</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.pct}>{progress}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 32 },
  track: {
    width: "70%",
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
  },
  fill: { height: 8, backgroundColor: colors.primary, borderRadius: 4 },
  pct: { marginTop: 12, fontSize: 14, color: colors.textSubtle },
});
