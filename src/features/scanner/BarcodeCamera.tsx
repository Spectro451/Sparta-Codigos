import React from "react";
import { StyleSheet } from "react-native";
import { CameraView } from "expo-camera";
import type { BarcodeCameraProps } from "./BarcodeCamera.types";

export function BarcodeCamera({ active, onScan }: BarcodeCameraProps) {
  if (!active) return null;
  return (
    <CameraView
      style={StyleSheet.absoluteFill}
      facing="back"
      onBarcodeScanned={({ data }) => onScan(data)}
    />
  );
}
