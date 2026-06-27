import React, { useState } from 'react'
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { colors } from '../../constants/colors'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { DataService, type Producto } from '../../services/DataService'
import type { ProductRouteParams } from '../../navigation/types'

export type BuscadorStackParamList = { BuscadorMain: undefined } & ProductRouteParams

type Props = {
  navigation: NativeStackNavigationProp<BuscadorStackParamList, 'BuscadorMain'>
}

export function BuscadorScreen({ navigation }: Props) {
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState<Producto[]>([])

  async function buscar(text: string) {
    setQuery(text)
    setResultados(await DataService.searchByEstilo(text))
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar por código de estilo..."
        placeholderTextColor={colors.textPlaceholder}
        value={query}
        onChangeText={buscar}
        autoCapitalize="characters"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      <FlatList
        data={resultados}
        keyExtractor={item => item.estilo}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.fila}
            onPress={() => navigation.navigate('Producto', { codebar: item.codebar })}
          >
            <Text style={styles.estilo}>{item.estilo}</Text>
            <Text style={styles.descripcion} numberOfLines={1}>{item.descripcion}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
        ListEmptyComponent={
          query.length > 0
            ? <Text style={styles.vacio}>Sin resultados para "{query}"</Text>
            : null
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  input: {
    margin: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    fontSize: 15,
    backgroundColor: colors.backgroundStripe,
  },
  fila: { paddingHorizontal: 16, paddingVertical: 12 },
  estilo: { fontSize: 14, fontWeight: '700', color: colors.textSecondary, marginBottom: 2 },
  descripcion: { fontSize: 13, color: colors.textSubtle },
  separador: { height: 1, backgroundColor: colors.separator, marginLeft: 16 },
  vacio: { textAlign: 'center', color: colors.textPlaceholder, marginTop: 32, fontSize: 14 },
})
