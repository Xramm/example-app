import React, {useState} from 'react';
import {Button, Text, TextInput, View} from 'react-native';
import {secondaryColor} from './ColorPalette';
import {useUser} from '../hooks/ApiHooks';
import {Controller, useForm} from 'react-hook-form';

const RegisterForm = (props) => {
  const {postUser} = useUser();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {username: '', password: '', email: '', full_name: ''},
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

  return (
    <View>
      <Text>Register Form</Text>
      <Controller
        control={control}
        rules={{required: true, minLength: 3}}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            placeholder="Username"
            onblur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="username"
      />

      {errors.username?.type === 'required' && (
        <Text>Username is required.</Text>
      )}
      {errors.username?.type === 'minLength' && (
        <Text>Username is too short.</Text>
      )}

      <Controller
        control={control}
        rules={{required: true}}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            placeholder="Full Name"
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
        rules={{required: true, minLength: 5}}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            placeholder="Password"
            secureTextEntry={!displayPassword}
            onblur={onBlur}
            onChangeText={onChange}
            value={value}
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
        rules={{required: true}}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            placeholder="Email"
            onblur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="email"
      />

      {errors.email?.type === 'required' && <Text>Email is required.</Text>}

      <Button
        color={secondaryColor}
        title="Register"
        onPress={handleSubmit(register)}
      />
    </View>
  );
};

export default RegisterForm;
