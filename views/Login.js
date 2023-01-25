import React, {useContext, useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Button,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {secondaryColor} from '../components/ColorPalette';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Login = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {getUserByToken} = useUser();

  const [toggleForm, setToggleForm] = useState(true);

  const checkToken = async () => {
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

  const onFormTogglePress = () => {
    setToggleForm(!toggleForm);
  };

  return (
    <TouchableOpacity
      onPress={() => Keyboard.dismiss()}
      style={styles.container}
      activeOpacity={1}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {toggleForm ? <LoginForm /> : <RegisterForm />}
        <Text>
          {toggleForm ? 'Need an account?' : 'Already have an account?'}
        </Text>
        <Button
          color={secondaryColor}
          title={toggleForm ? 'Register Form' : 'Login Form'}
          onPress={onFormTogglePress}
        />
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
