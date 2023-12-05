import React from 'react';
import { Stack } from 'expo-router';
import Logo from '../../components/Header/Logo';

const Layout = () => (
  <Stack
    screenOptions={{
      headerStyle: {
        backgroundColor: '#fff',
        height: 40,
      } as React.CSSProperties,
      headerTintColor: '#000',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen
      name="index"
      options={{
        headerShown: true,
        headerTitle: (props) => <Logo {...props} />,
      }}
    />
  </Stack>
);

export default Layout;
