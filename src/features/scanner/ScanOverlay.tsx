import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { colors } from "../../constants/colors";
import { Button } from "../../components/Button";

const SCAN_CORNER_SIZE = 20;

type Props = {
  onManualPress: () => void;
};

export function ScanOverlay({ onManualPress }: Props) {
  const { width } = useWindowDimensions();
  const boxSize = Math.round(width * 0.7);

  return (
    <View style={styles.overlay}>
      <View style={styles.top} />
      <View style={[styles.middle, { height: boxSize }]}>
        <View style={styles.side} />
        <View style={{ width: boxSize, height: boxSize }}>
          <View style={[styles.esquina, styles.tl]} />
          <View style={[styles.esquina, styles.tr]} />
          <View style={[styles.esquina, styles.bl]} />
          <View style={[styles.esquina, styles.br]} />
        </View>
        <View style={styles.side} />
      </View>
      <View style={styles.bottom}>
        <Button variant="secondary" onPress={onManualPress}>
          Ingresar código manual
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1 },
  top: { flex: 1, backgroundColor: colors.scanOverlay },
  middle: { flexDirection: "row" },
  side: { flex: 1, backgroundColor: colors.scanOverlay },
  bottom: {
    flex: 1,
    backgroundColor: colors.scanOverlay,
    alignItems: "center",
    justifyContent: "center",
  },
  esquina: {
    position: "absolute",
    width: SCAN_CORNER_SIZE,
    height: SCAN_CORNER_SIZE,
    borderColor: colors.onPrimary,
    borderWidth: 3,
  },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
});
