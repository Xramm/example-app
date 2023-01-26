import React, {useState} from 'react';
import {View} from 'react-native';
import {secondaryColor} from './ColorPalette';
import {useUser} from '../hooks/ApiHooks';
import {Controller, useForm} from 'react-hook-form';
import {Input, Button, Text} from '@rneui/base';

const RegisterForm = (props) => {
  const {postUser, checkUsername} = useUser();
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      full_name: '',
    },
    mode: 'onBlur',
  });
  const [displayPassword, changeDisplayPassword] = useState(false);

  const register = async (userData) => {
    delete userData.confirmPassword;
    console.log('Registering: ', userData);
    try {
      const registerResult = await postUser(userData);
      console.log('Register, register', registerResult);

      if (registerResult.user_id === null) return; // Did not successfully register so stop here
    } catch (error) {
      console.error('Register, register: ', error);
      // TODO: notify user about failed registering
      return;
    }
  };

  const checkUser = async (username) => {
    try {
      const userAvailable = await checkUsername(username);
      console.log('RegisterForm, checkUser: ' + userAvailable);
      return userAvailable || 'Username is already taken';
    } catch (error) {
      console.error('RegisterForm, checkUser: ', error.message);
    }
  };

  return (
    <View>
      <Text>Registeration Form</Text>
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Required'},
          minLength: {value: 3, message: 'Minimum length is 3'},
          validate: {checkUser},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Username"
            autoCapitalize="none"
            onblur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.username && errors.username.message}
          />
        )}
        name="username"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Required'},
          minLength: {value: 2, message: 'Must be at least 2 characters'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Full Name"
            autoCapitalize="words"
            onblur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.full_name && errors.full_name.message}
          />
        )}
        name="full_name"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Required'},
          minLength: {value: 5, message: 'Must have at least 5 characters'},
          pattern: {
            value: /(?=.*\p{Lu})(?=.*[0-9]).{5,}/u,
            message: 'Must include one upper case letter and one number',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Password"
            secureTextEntry={!displayPassword}
            onblur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.password && errors.password.message}
          />
        )}
        name="password"
      />

      <Controller
        control={control}
        rules={{
          validate: (value) => {
            if (value === getValues('password')) {
              return true;
            }
            return 'Password needs to match';
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Confirm Password"
            secureTextEntry={!displayPassword}
            onblur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={
              errors.confirmPassword && errors.confirmPassword.message
            }
          />
        )}
        name="confirmPassword"
      />

      <Button
        color={secondaryColor}
        title={displayPassword ? 'Hide Password' : 'Show Password'}
        onPress={() => {
          changeDisplayPassword(!displayPassword);
        }}
      />
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Required'},
          pattern: {
            value: /^[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            message: 'Invalid Email form',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Email"
            autoCapitalize="none"
            onblur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.email && errors.email.message}
          />
        )}
        name="email"
      />

      <Button
        color={secondaryColor}
        title="Register"
        onPress={handleSubmit(register)}
      />
    </View>
  );
};

export default RegisterForm;
