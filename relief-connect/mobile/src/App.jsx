import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from './screens/Login'
import ReportIncident from './screens/ReportIncident'
import OfflineQueue from './screens/OfflineQueue'

const Stack = createNativeStackNavigator()

export default function App(){
  const [token, setToken] = useState(null)

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <Stack.Screen name="Login" options={{ title: 'Login' }}>
            {(props) => <Login {...props} onLogin={setToken} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="ReportIncident" component={ReportIncident} options={{ title: 'Report' }} />
            <Stack.Screen name="OfflineQueue" component={OfflineQueue} options={{ title: 'Offline' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
