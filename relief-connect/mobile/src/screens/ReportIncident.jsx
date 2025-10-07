import React, { useState } from 'react'
import { View, Text, TextInput, Button, Alert, Image } from 'react-native'
import axios from 'axios'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:4000'

export default function ReportIncident(){
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('medical')
  const [photo, setPhoto] = useState(null)

  async function pickPhoto(){
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 })
    if (!res.canceled) setPhoto(res.assets[0])
  }

  async function submit(){
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') throw new Error('Permission denied')
      const pos = await Location.getCurrentPositionAsync({})
      const loc = { type: 'Point', coordinates: [pos.coords.longitude, pos.coords.latitude] }
      let media = []
      if (photo) {
        const form = new FormData()
        form.append('file', { uri: photo.uri, name: 'photo.jpg', type: 'image/jpeg' })
        const up = await axios.post(API_BASE + '/api/upload', form, { headers: { 'Content-Type': 'multipart/form-data', Authorization: 'Bearer ' + 'devtoken' } })
        media = [{ url: up.data.data.url, type: 'image' }]
      }
      await axios.post(API_BASE + '/api/reports', { description, category, location: loc, media }, { headers: { Authorization: 'Bearer ' + 'devtoken' } })
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
      {photo && <Image source={{ uri: photo.uri }} style={{ width: 120, height: 120, marginBottom: 8 }} />}
      <Button title="Pick Photo" onPress={pickPhoto} />
      <View style={{ height: 8 }} />
      <Button title="Submit" onPress={submit} />
    </View>
  )
}
