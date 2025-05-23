import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import CadastroScreen from "./screens/CadastroScreen";
import Home from "./screens/Home";
import ListadeSalas from "./screens/ListadeSalas";
import ProfileScreen from "./screens/ProfileScreen";


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ListaDeSalas" component={ListadeSalas} />
        <Stack.Screen name="Perfil" component={ProfileScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
