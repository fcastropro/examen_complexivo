import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import MesasScreen from "./src/screens/MesasScreen";
import PedidosScreen from "./src/screens/PedidosScreen";
import RestaurantServicesScreen from "./src/screens/RestaurantServicesScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Mesas: undefined;
  Pedidos: undefined;
  RestaurantServices: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Menú" }} />
        <Stack.Screen name="Mesas" component={MesasScreen} options={{ title: "Mesas" }} />
        <Stack.Screen name="Pedidos" component={PedidosScreen} options={{ title: "Pedidos" }} />
        <Stack.Screen name="RestaurantServices" component={RestaurantServicesScreen} options={{ title: "Servicios" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
