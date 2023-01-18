import React, {useContext, useEffect} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {backgroundColor, secondaryColor} from '../components/ColorPalette';
import {useAuthentication, useUser} from '../hooks/ApiHooks';

const Login = ({navigation}) => {
  const {setIsLoggedIn} = useContext(MainContext);
  const {postLogin} = useAuthentication();

  const logIn = async () => {
    console.log('Logging in!');
    const data = {username: 'juliusli', password: 'pass123'};
    try {
      const loginResult = await postLogin(data);
      console.log('LogIn, logIn', loginResult);
      await AsyncStorage.setItem('userToken', loginResult.token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('LogIn, logIn: ', error);
    }
  };

  const checkToken = async () => {
    const {getUserByToken} = useUser();

    try {
      const userToken = await AsyncStorage.getItem('userToken');
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
      <Text>Login</Text>
      <Button color={secondaryColor} title="Sign in!" onPress={logIn} />
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
