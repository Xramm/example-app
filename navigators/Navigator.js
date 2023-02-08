import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Home from '../views/Home';
import AllMedia from '../views/AllMedia';
import Profile from '../views/Profile';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Single from '../views/Single';
import Login from '../views/Login';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {MainStyles} from '../components/Styles';
import {
  navigationFocusedTextColor,
  navigationUnfocusedTextColor,
} from '../components/ColorPalette';
import Upload from '../views/Upload';
import {Icon} from '@rneui/themed';
import MyFiles from '../views/MyFiles';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
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
          tabBarIcon: ({color}) => <Icon name="home" color={color} />,
        }}
      />
      <Tab.Screen
        name="All Media"
        component={AllMedia}
        options={{
          headerStyle: MainStyles.NavigationHeader,
          headerTitleStyle: MainStyles.NavigationHeaderTitle,
          tabBarIcon: ({color}) => <Icon name="photo" color={color} />,
        }}
      />
      <Tab.Screen
        name="Upload"
        component={Upload}
        options={{
          headerStyle: MainStyles.NavigationHeader,
          headerTitleStyle: MainStyles.NavigationHeaderTitle,
          tabBarIcon: ({color}) => <Icon name="cloud-upload" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerStyle: MainStyles.NavigationHeader,
          headerTitleStyle: MainStyles.NavigationHeaderTitle,
          tabBarIcon: ({color}) => <Icon name="person" color={color} />,
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
          <Stack.Screen
            name="MyFiles"
            component={MyFiles}
            options={{
              headerTitle: 'My Files',
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
