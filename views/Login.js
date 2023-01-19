import React, {useContext, useEffect} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {backgroundColor} from '../components/ColorPalette';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Login = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);

  const checkToken = async () => {
    const {getUserByToken} = useUser();
    try {
      const userToken = await AsyncStorage.getItem('userToken');

      if (userToken === null) return; // Return if no existing token

      console.log('Login, checkToken, token:', userToken);
      const userData = await getUserByToken(userToken);
      console.log(userData);
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.warn('No valid token available', error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <TouchableOpacity
      onPress={() => Keyboard.dismiss()}
      style={styles.container}
      activeOpacity={1}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LoginForm />
        <RegisterForm />
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
