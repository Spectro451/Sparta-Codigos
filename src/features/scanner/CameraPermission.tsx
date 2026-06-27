import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "../../components/Button";

type Props = {
  onRequest: () => void;
};

export function CameraPermission({ onRequest }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>
        Se necesita acceso a la cámara para escanear
      </Text>
      <Button onPress={onRequest}>Dar permiso</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  texto: { fontSize: 16, textAlign: "center", marginBottom: 24 },
});
