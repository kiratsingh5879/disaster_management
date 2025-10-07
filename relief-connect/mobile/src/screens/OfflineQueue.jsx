import React from 'react'
import { View, Text } from 'react-native'

export default function OfflineQueue(){
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Offline Queue</Text>
      <Text>Queued reports will appear here (MVP placeholder).</Text>
    </View>
  )
}
