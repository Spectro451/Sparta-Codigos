import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";
import { Button } from "../../components/Button";

type Props = {
  onSubmit: (codigo: string) => void;
  onVolverCamara?: () => void;
};

export function ManualEntryView({ onSubmit, onVolverCamara }: Props) {
  const [codigo, setCodigo] = useState("");

  function handleSubmit() {
    const trimmed = codigo.trim();
    if (!trimmed) return;
    setCodigo("");
    onSubmit(trimmed);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Ingresar código</Text>
      <TextInput
        style={styles.input}
        placeholder="Código de barras"
        placeholderTextColor={colors.textFaint}
        value={codigo}
        onChangeText={setCodigo}
        keyboardType="number-pad"
        autoFocus
        onSubmitEditing={handleSubmit}
      />
      <Button
        variant="secondary"
        fullWidth
        onPress={handleSubmit}
        style={{ marginBottom: 16 }}
      >
        Buscar
      </Button>

      {onVolverCamara && (
        <Button variant="ghost" onPress={onVolverCamara}>
          Volver a cámara
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundCamera,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.onPrimary,
    marginBottom: 24,
  },
  input: {
    width: "100%",
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: colors.onPrimary,
    marginBottom: 12,
  },
});
