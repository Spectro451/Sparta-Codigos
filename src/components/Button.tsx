import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../constants/colors";

type ButtonVariant = "primary" | "secondary" | "ghost";

type Props = {
  onPress: () => void;
  children: string;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  style?: ViewStyle;
};

export function Button({
  onPress,
  children,
  variant = "primary",
  fullWidth,
  style,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        fullWidth && styles.fullWidth,
        style,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.texto, styles[`texto_${variant}`]]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  fullWidth: { width: "100%", paddingHorizontal: 0 },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.background },
  ghost: { backgroundColor: "transparent", paddingHorizontal: 12 },
  texto: { fontSize: 16, fontWeight: "600" },
  texto_primary: { color: colors.onPrimary },
  texto_secondary: { color: colors.primary },
  texto_ghost: { fontSize: 14, color: colors.textFaint },
});
