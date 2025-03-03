import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './ecrans/Main/Home';
import Parameters from './ecrans/Main/Parameters';
import Notifications from './ecrans/Main/Notifications';

export default function App() {
  const Onglets = createBottomTabNavigator({
    initialRouteName: 'Home',
    screens: {
      Parameters: {
        screen: Parameters,
      },
      Home: {
        screen: Home,
      },
     
      Notifications: {
        screen: Notifications,
      }
    },
  });

  // const RootStack = createNativeStackNavigator({
  //   initialRouteName: "Menu",
  //   screens: {
  //     Menu: {
  //       screen: Onglets,
  //       options: {
  //         headerShown: false,
  //       },
  //     },
  //     Modifier: Modifier,
  //   },
  // })

  const Navigation = createStaticNavigation(Onglets);
  return (
    <Navigation />
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
