import React, { useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import axios from 'axios'

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:4000'

export default function Login({ onLogin }){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(){
    try {
      const { data } = await axios.post(API_BASE + '/api/auth/login', { email, password })
      onLogin(data.data.token)
    } catch (e) {
      Alert.alert('Login failed')
    }
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 8, marginBottom: 8 }} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, padding: 8, marginBottom: 8 }} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  )
}
