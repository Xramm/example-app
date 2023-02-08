import {Card} from '@rneui/themed';
import PropTypes from 'prop-types';
import {Controller, useForm} from 'react-hook-form';
import {Input, Button} from '@rneui/base';
import {secondaryColor} from '../components/ColorPalette';
import {CardDivider} from '@rneui/base/dist/Card/Card.Divider';
import {
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useContext, useState, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Video} from 'expo-av';
import {uploadsUrl} from '../utils/variables';

const Modify = ({navigation, route}) => {
  const {file} = route.params;
  const {putMedia} = useMedia();
  const {update, setUpdate} = useContext(MainContext);
  const [isLoading, setIsLoading] = useState(false);
  const video = useRef(null);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {title: file.title, description: file.description},
    mode: 'onChange',
  });

  const modifyFile = async (data) => {
    setIsLoading(true);

    console.log('Upload, uploadFile: Data: ' + data);

    try {
      const userToken = await AsyncStorage.getItem('userToken');

      const result = await putMedia(file.file_id, data, userToken);
      console.log('Upload, uploadFile: ' + result);

      Alert.alert('Success', result.message, [
        {
          text: 'Ok',
          onPress: () => {
            console.log('Ok Pressed, navigating to home screen...');
            // TODO: update the 'update' state and navigate to the home tab.
            setUpdate(!update);

            navigation.navigate('MyFiles');
          },
        },
      ]);
    } catch (error) {
      console.error('Modify, modifyFile: Modify failed!', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView>
      <TouchableOpacity
        onPress={() => Keyboard.dismiss()}
        style={styles.container}
        activeOpacity={1}
      >
        <Card>
          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'Required'},
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Title"
                onblur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.title && errors.title.message}
              />
            )}
            name="title"
          />

          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Description"
                onblur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.description && errors.description.message}
              />
            )}
            name="description"
          />

          {file.media_type === 'video' ? (
            <Video
              ref={video}
              source={{uri: uploadsUrl + file.filename}}
              style={{width: '100%', height: 200}}
              useNativeControls
              resizeMode="contain"
              onError={(error) => {
                console.log('Single, Single: ' + error);
              }}
            />
          ) : (
            <Card.Image source={uploadsUrl + file.filename} />
          )}

          <CardDivider />
        </Card>
        <Card>
          <Button
            color={secondaryColor}
            title="Modify"
            onPress={handleSubmit(modifyFile)}
          />
          {isLoading && <ActivityIndicator size="large" />}
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
};

Modify.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default Modify;
