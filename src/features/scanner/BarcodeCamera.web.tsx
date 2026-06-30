import React, { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import type { BarcodeCameraProps } from "./BarcodeCamera.types";

function getBarcodeFormats(): BarcodeFormat[] {
  return [BarcodeFormat.UPC_A, BarcodeFormat.EAN_13];
}

export function BarcodeCamera({ active, onScan }: BarcodeCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  useEffect(() => {
    if (!active || !videoRef.current) return;

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, getBarcodeFormats());
    hints.set(DecodeHintType.TRY_HARDER, true);
    const reader = new BrowserMultiFormatReader(hints);

    let stopped = false;
    let stop: (() => void) | undefined;

    reader
      .decodeFromConstraints(
        { video: { facingMode: "environment" } },
        videoRef.current,
        (result) => {
          if (result) onScanRef.current(result.getText());
        }
      )
      .then((controls) => {
        if (stopped) controls.stop();
        else stop = () => controls.stop();
      })
      .catch((err) => {
        console.warn("No se pudo iniciar la cámara web:", err);
      });

    return () => {
      stopped = true;
      stop?.();
    };
  }, [active]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  );
}
