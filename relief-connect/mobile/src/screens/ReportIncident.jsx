import React, { useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import axios from 'axios'

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:4000'

export default function ReportIncident(){
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('medical')

  async function submit(){
    try {
      const loc = { type: 'Point', coordinates: [77.6, 12.97] }
      await axios.post(API_BASE + '/api/reports', { description, category, location: loc }, { headers: { Authorization: 'Bearer ' + 'devtoken' } })
      Alert.alert('Report submitted')
    } catch (e) {
      Alert.alert('Failed to submit')
    }
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Report Incident</Text>
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={{ borderWidth: 1, padding: 8, marginBottom: 8 }} />
      <TextInput placeholder="Category (medical, fire...)" value={category} onChangeText={setCategory} style={{ borderWidth: 1, padding: 8, marginBottom: 8 }} />
      <Button title="Submit" onPress={submit} />
    </View>
  )
}
