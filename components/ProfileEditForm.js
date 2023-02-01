import React, {useContext} from 'react';
import {View} from 'react-native';
import {secondaryColor} from './ColorPalette';
import {useUser} from '../hooks/ApiHooks';
import {Controller, useForm} from 'react-hook-form';
import {Input, Button, Text} from '@rneui/themed';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileEditForm = (props) => {
  const {changeUser} = useUser();
  const {user} = useContext(MainContext);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      token: null,
      email: user.email,
      full_name: user.full_name,
    },
    mode: 'onBlur',
  });

  const saveChanges = async (userData) => {
    console.log('Updating user data: ', userData);
    try {
      const userToken = await AsyncStorage.getItem('userToken');

      if (userToken === null) {
        console.error(
          'ProfileEditForm, saveChanges: Trying to change user data without a token'
        );
        return;
      }

      userData.token = userToken;

      const saveResult = await changeUser(userData);
      console.log('ProfileEditForm, saveChanges', saveResult);
    } catch (error) {
      console.error('ProfileEditForm, saveChanges: ', error);
      // TODO: notify user about failed update
      return;
    }
  };

  return (
    <View>
      <Text>User Edit Form</Text>
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
        title="Save Changes"
        onPress={handleSubmit(saveChanges)}
      />
    </View>
  );
};

export default ProfileEditForm;
