import React, { useState, useRef } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { colors } from "../../constants/colors";
import { SCAN_DEBOUNCE_MS } from "../../constants/config";
import { useCameraPermissions } from "expo-camera";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useIsFocused } from "@react-navigation/native";
import { BarcodeCamera } from "./BarcodeCamera";
import { CameraPermission } from "./CameraPermission";
import { ScanOverlay } from "./ScanOverlay";
import { ManualEntryView } from "./ManualEntryView";
import type { ProductRouteParams } from "../../navigation/types";

export type ScannerStackParamList = {
  ScannerMain: undefined;
} & ProductRouteParams;

type Props = {
  navigation: NativeStackNavigationProp<ScannerStackParamList, "ScannerMain">;
};

type Modo = "camara" | "manual";

export function ScannerScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [modo, setModo] = useState<Modo>("camara");
  const escaneando = useRef(false);
  const isFocused = useIsFocused();

  function handleScan(codebar: string) {
    if (escaneando.current) return;
    escaneando.current = true;
    navigation.navigate("Producto", { codebar });
    setTimeout(() => {
      escaneando.current = false;
    }, SCAN_DEBOUNCE_MS);
  }

  if (modo === "manual") {
    return (
      <ManualEntryView
        onSubmit={handleScan}
        onVolverCamara={() => setModo("camara")}
      />
    );
  }

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted && Platform.OS !== "web")
    return <CameraPermission onRequest={requestPermission} />;

  return (
    <View style={styles.container}>
      <BarcodeCamera active={isFocused} onScan={handleScan} />
      <ScanOverlay onManualPress={() => setModo("manual")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundCamera },
});
