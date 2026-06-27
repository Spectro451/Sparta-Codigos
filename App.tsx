import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import {
  DataService,
  SAN_ANTONIO_ID,
  type Tienda,
} from "./src/services/DataService";
import { SplashScreen } from "./src/components/SplashScreen";
import { StoreSelector } from "./src/features/store/StoreSelector";
import { TabNavigator } from "./src/navigation/TabNavigator";
import { Button } from "./src/components/Button";
import { colors } from "./src/constants/colors";

type AppState =
  | "loading_tienda"
  | "select_tienda"
  | "initializing"
  | "ready"
  | "error";

export default function App() {
  const [appState, setAppState] = useState<AppState>("loading_tienda");
  const [progress, setProgress] = useState(0);
  const [tienda, setTienda] = useState<Tienda | null>(null);

  useEffect(() => {
    DataService.getCurrentTienda().then((saved) => {
      if (!saved) {
        setAppState("select_tienda");
      } else {
        setTienda(saved);
        inicializar(saved);
      }
    });
  }, []);

  function inicializar(t: Tienda) {
    if (t.id === SAN_ANTONIO_ID) {
      setAppState("initializing");
      setProgress(0);
      DataService.initialize(setProgress)
        .then(() => setAppState("ready"))
        .catch(() => setAppState("error"));
    } else {
      setAppState("ready");
    }
  }

  async function onTiendaSeleccionada(t: Tienda) {
    await DataService.setCurrentTienda(t);
    setTienda(t);
    inicializar(t);
  }

  function onCambiarTienda() {
    setAppState("select_tienda");
  }

  if (appState === "loading_tienda" || appState === "initializing") {
    return (
      <SplashScreen progress={appState === "initializing" ? progress : 0} />
    );
  }

  if (appState === "select_tienda") {
    return <StoreSelector onTiendaSeleccionada={onTiendaSeleccionada} />;
  }

  if (appState === "error") {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitulo}>Sin conexión</Text>
        <Text style={styles.errorMensaje}>
          No se pudo cargar el catálogo. Verifica tu conexión e intenta de nuevo.
        </Text>
        <Button onPress={() => tienda && inicializar(tienda)}>
          Reintentar
        </Button>
      </View>
    );
  }

  if (!tienda) return null;

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <TabNavigator tienda={tienda} onCambiarTienda={onCambiarTienda} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: colors.background,
  },
  errorTitulo: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: colors.primary,
  },
  errorMensaje: {
    fontSize: 15,
    color: colors.textSubtle,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
});
