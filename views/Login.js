import React, {useContext, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {backgroundColor} from '../components/ColorPalette';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';

const Login = ({navigation}) => {
  const {setIsLoggedIn} = useContext(MainContext);

  const checkToken = async () => {
    const {getUserByToken} = useUser();
    try {
      const userToken = await AsyncStorage.getItem('userToken');

      if (userToken === null) return; // Return if no existing token

      console.log('Login, checkToken, token:', userToken);
      const userData = await getUserByToken(userToken);
      console.log(userData);
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
    <View style={styles.container}>
      <LoginForm />
    </View>
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
