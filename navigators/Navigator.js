import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Home from '../views/Home';
import Profile from '../views/Profile';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Single from '../views/Single';
import Login from '../views/Login';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {MainStyles} from '../components/Styles';
import {
  navigationFocusedTextColor,
  navigationUnfocusedTextColor,
} from '../components/ColorPalette';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          const currentColor = focused
            ? navigationFocusedTextColor
            : navigationUnfocusedTextColor;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Ionicons name={iconName} color={currentColor} size={size} />;
        },
        tabBarStyle: MainStyles.TabBarStyle,
        tabBarActiveTintColor: navigationFocusedTextColor,
        tabBarInactiveTintColor: navigationUnfocusedTextColor,
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerStyle: MainStyles.NavigationHeader,
          headerTitleStyle: MainStyles.NavigationHeaderTitle,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerStyle: MainStyles.NavigationHeader,
          headerTitleStyle: MainStyles.NavigationHeaderTitle,
        }}
      />
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const {isLoggedIn} = useContext(MainContext);
  return (
    <Stack.Navigator>
      {isLoggedIn ? ( // Conditional rendering between login screen and the rest of the app
        <>
          <Stack.Screen
            name="Tabs"
            component={TabScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Single"
            component={Single}
            options={{
              headerTitle: 'Post',
              headerStyle: MainStyles.NavigationHeader,
              headerTitleStyle: MainStyles.NavigationHeaderTitle,
            }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerStyle: MainStyles.NavigationHeader,
            headerTitleStyle: MainStyles.NavigationHeaderTitle,
          }}
        />
      )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;
