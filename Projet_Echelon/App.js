import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './ecrans/Main/Home';
import Parameters from './ecrans/Main/Parameters';
import Notifications from './ecrans/Main/Notification';
import Picture from './ecrans/Main/Picture';
import Mapping from './ecrans/Main/Mapping';
import MappingSaved from './ecrans/Main/Mapping_Saved';
import MappingCreate from './ecrans/Main/Mapping_Create';

export default function App() {
  const Onglets = createBottomTabNavigator({
    initialRouteName: 'Home',
    screens: {
      Parameters: {
        screen: Parameters,
        options: {
          headerShown: false,
        },
      },
      Home: {
        screen: Home,
        options: {
          headerShown: false,
        },
      },
      Notifications: {
        screen: Notifications,
        options: {
          headerShown: false,
        },
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
    <MappingCreate/>
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
