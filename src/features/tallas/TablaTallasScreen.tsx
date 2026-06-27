import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";
import {
  tallasHombre,
  tallasMujer,
  tallasNinos,
  tallasJovenes,
} from "../../data/tablaTallas";
import { TallasTable } from "./TallasTable";

type TabPrincipal = "hombre" | "mujer" | "ninos";
type TabNinos = "ninos" | "jovenes";

export function TablaTallasScreen() {
  const [tabPrincipal, setTabPrincipal] = useState<TabPrincipal>("hombre");
  const [tabNinos, setTabNinos] = useState<TabNinos>("ninos");

  return (
    <View style={styles.container}>
      <TabBar
        tabs={[
          { key: "hombre", label: "Hombre" },
          { key: "mujer", label: "Mujer" },
          { key: "ninos", label: "Niños" },
        ]}
        activo={tabPrincipal}
        onSelect={(key) => setTabPrincipal(key as TabPrincipal)}
      />

      {tabPrincipal === "hombre" && <TallasTable datos={tallasHombre} />}
      {tabPrincipal === "mujer" && <TallasTable datos={tallasMujer} />}
      {tabPrincipal === "ninos" && (
        <View style={styles.flex}>
          <TabBar
            tabs={[
              { key: "ninos", label: "Niños" },
              { key: "jovenes", label: "Jóvenes" },
            ]}
            activo={tabNinos}
            onSelect={(key) => setTabNinos(key as TabNinos)}
            secundario
          />
          {tabNinos === "ninos" && <TallasTable datos={tallasNinos} />}
          {tabNinos === "jovenes" && <TallasTable datos={tallasJovenes} />}
        </View>
      )}
    </View>
  );
}

type Tab = { key: string; label: string };

function TabBar({
  tabs,
  activo,
  onSelect,
  secundario = false,
}: {
  tabs: Tab[];
  activo: string;
  onSelect: (key: string) => void;
  secundario?: boolean;
}) {
  return (
    <View style={[styles.tabBar, secundario && styles.tabBarSecundario]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            activo === tab.key &&
              (secundario ? styles.tabActivoSecundario : styles.tabActivo),
          ]}
          onPress={() => onSelect(tab.key)}
        >
          <Text
            style={[
              styles.tabTexto,
              activo === tab.key &&
                (secundario
                  ? styles.tabTextoActivoSecundario
                  : styles.tabTextoActivo),
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },

  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.primary,
  },
  tabBarSecundario: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  tab: { flex: 1, paddingVertical: 14, alignItems: "center" },
  tabActivo: { borderBottomWidth: 3, borderBottomColor: colors.onPrimary },
  tabActivoSecundario: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },

  tabTexto: { fontSize: 14, color: colors.textMuted, fontWeight: "500" },
  tabTextoActivo: { color: colors.onPrimary, fontWeight: "700" },
  tabTextoActivoSecundario: { color: colors.primary, fontWeight: "700" },
});
