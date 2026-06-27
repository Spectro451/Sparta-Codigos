import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ScannerScreen } from "../features/scanner/ScannerScreen";
import { ProductScreen } from "../features/product/ProductScreen";
import { TablaTallasScreen } from "../features/tallas/TablaTallasScreen";
import { BuscadorScreen } from "../features/buscador/BuscadorScreen";
import { AppHeader } from "../components/AppHeader";
import type { Tienda } from "../services/DataService";
import type { ScannerStackParamList } from "../features/scanner/ScannerScreen";
import type { BuscadorStackParamList } from "../features/buscador/BuscadorScreen";

const Tab = createBottomTabNavigator();
const ScannerStack = createNativeStackNavigator<ScannerStackParamList>();
const BuscadorStack = createNativeStackNavigator<BuscadorStackParamList>();

function ScannerNavigator() {
  return (
    <ScannerStack.Navigator screenOptions={{ headerShown: false }}>
      <ScannerStack.Screen name="ScannerMain" component={ScannerScreen} />
      <ScannerStack.Screen name="Producto" component={ProductScreen} />
    </ScannerStack.Navigator>
  );
}

function BuscadorNavigator() {
  return (
    <BuscadorStack.Navigator screenOptions={{ headerShown: false }}>
      <BuscadorStack.Screen name="BuscadorMain" component={BuscadorScreen} />
      <BuscadorStack.Screen name="Producto" component={ProductScreen} />
    </BuscadorStack.Navigator>
  );
}

type Props = {
  tienda: Tienda;
  onCambiarTienda: () => void;
};

export function TabNavigator({ tienda, onCambiarTienda }: Props) {
  return (
    <Tab.Navigator
      screenOptions={{
        header: () => (
          <AppHeader tienda={tienda} onCambiarTienda={onCambiarTienda} />
        ),
        tabBarLabelStyle: { fontSize: 13 },
      }}
    >
      <Tab.Screen
        name="Escanear"
        component={ScannerNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="barcode" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Buscador"
        component={BuscadorNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tallas"
        component={TablaTallasScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="ruler" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
