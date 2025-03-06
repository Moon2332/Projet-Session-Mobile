import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './ecrans/Main/Home';
import Parameters from './ecrans/Main/Parameters';
import Notifications from './ecrans/Main/Notification';
import Picture from './ecrans/Main/Picture';
import Intro from './ecrans/Account/Intro';
import SignUp from './ecrans/Account/SignUp';
import { ParamsProvider } from './useParams';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { faBell, faGear, faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Mapping from './ecrans/Main/Mapping';
import MappingSaved from './ecrans/Main/Mapping_Saved';
import MappingCreate from './ecrans/Main/Mapping_Create';
import { refreshToken } from './api/user'
import Account from './ecrans/Autres/Account';
import { deleteUserInfo } from './api/secureStore';

export default function App() {
  const { t } = useTranslation();
  const [landingPage, setLandingPage] = useState("Auth");

  useEffect(() => {
    isUserLoggedIn();
  }, [])

  const isUserLoggedIn = async () => {
    try {
      const response = await refreshToken();
      setLandingPage("Menu")
    } catch (error) {
      console.log(error)
      setLandingPage("Auth")
    }
  }

  const authStack = createNativeStackNavigator({
    initialRouteName: "Intro",
    screenOptions: {
      headerShown: false
    },
    screens: {
      Intro: {
        screen: Intro,
      },
      SignUp: {
        screen: SignUp,
      }
    },
  })

  const bottomTabs = createBottomTabNavigator({
    initialRouteName: 'Home',
    screenOptions: ({ route }) => ({
      tabBarIcon: ({ color }) => {
        let iconName;
        if (route.name === "Home") {
          iconName = faHouse
        } else if (route.name === "Parameters") {
          iconName = faGear
        }  else if (route.name === "Notifications") {
          iconName = faBell
        } 

        return <FontAwesomeIcon icon={iconName} size={35} color={color} />;
      },
      tabBarActiveTintColor: "green",
      tabBarInactiveTintColor: "gray",
      tabBarShowLabel: false,
      tabBarActiveBackgroundColor: "black",
      tabBarInactiveBackgroundColor: "black",
      tabBarLabelPosition: "below-icon",
      tabBarStyle: {
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
      },
      tabBarIconStyle: {
        margin: 5
      }
    }),
    screens: {
      Parameters: {
        screen: Parameters,
        options: {
          headerShown: false,
        },
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

  const RootStack = createNativeStackNavigator({
    initialRouteName: landingPage,
    screens: {
      Auth: {
        screen: authStack,
        options: {
          headerShown: false,
        },
      },
      Menu: {
        screen: bottomTabs,
        options: {
          headerShown: false,
        },
      },
      Account: {
        screen: Account,
        options: {
          headerShown: false,
        },
      },
    },
  })

  const Navigation = createStaticNavigation(RootStack);

  return (
    <ParamsProvider>
      <Navigation />
    </ParamsProvider>
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
