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
  } = useForm({
    defaultValues: {username: '', password: '', email: '', full_name: ''},
    mode: 'onBlur',
  });
  const [displayPassword, changeDisplayPassword] = useState(false);

  const register = async (userData) => {
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
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Full Name"
            autoCapitalize="words"
            onblur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="full_name"
      />

      {errors.full_name?.type === 'required' && (
        <Text>Full name is required.</Text>
      )}

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

      {errors.password && <Text>Password is too short.</Text>}

      <Button
        color={secondaryColor}
        title="Show Password"
        onPress={() => {
          changeDisplayPassword(!displayPassword);
        }}
      />
      <Controller
        control={control}
        rules={{required: {value: true, message: 'Required'}}}
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
