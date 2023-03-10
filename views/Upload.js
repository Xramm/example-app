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
import * as ImagePicker from 'expo-image-picker';
import React, {useContext, useState, useRef} from 'react';
import missingImage from '../img/missing.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Video} from 'expo-av';

const Upload = ({navigation}) => {
  const {
    control,
    handleSubmit,
    trigger,
    reset,
    formState: {errors},
  } = useForm({defaultValues: {title: '', description: ''}, mode: 'onChange'});
  const {postMediaWithAppTag} = useMedia();

  const {update, setUpdate} = useContext(MainContext);

  const [mediaFile, setMediaFile] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const video = useRef(null);

  const pickFile = async () => {
    try {
      // No permissions request is necessary for launching the image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      console.log(result);

      if (!result.canceled) {
        console.log('Upload, pickFile: File Picked: ' + result.assets[0]);
        setMediaFile(result.assets[0]);
        trigger();
      }
    } catch (error) {
      console.log('Upload, pickFile: ', error);
    }
  };

  const clearUpload = () => {
    reset();
    setMediaFile({});
  };

  const uploadFile = async (data) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);

    const filename = mediaFile.uri.split('/').pop();

    let fileExt = filename.split('.').pop();
    if (fileExt === 'jpg') fileExt = 'jpeg';

    const mimeType = mediaFile.type + '/' + fileExt;

    formData.append('file', {
      uri: mediaFile.uri,
      name: filename,
      type: mimeType,
    });

    console.log('Upload, uploadFile: Formdata Created: ' + formData);

    try {
      const userToken = await AsyncStorage.getItem('userToken');

      if (userToken === null) {
        throw new Error('No user token saved locally!');
      }

      const result = await postMediaWithAppTag(formData, userToken);
      console.log('Upload, uploadFile: ' + result);

      Alert.alert('Upload Complete', 'File id:' + result.file_id, [
        {
          text: 'Ok',
          onPress: () => {
            console.log('Ok Pressed, navigating to home screen...');
            // TODO: update the 'update' state and navigate to the home tab.
            setUpdate(!update);

            // Clear fields and file
            clearUpload();

            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.error('Upload, uploadFile: Upload failed!', error);
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

          {mediaFile.type === 'video' ? (
            <Video
              ref={video}
              source={{uri: mediaFile.uri}}
              style={{width: '100%', height: 200}}
              useNativeControls
              resizeMode="contain"
              onError={(error) => {
                console.log('Single, Single: ' + error);
              }}
            />
          ) : (
            <Card.Image
              source={mediaFile.uri ? {uri: mediaFile.uri} : missingImage}
              onPress={pickFile}
            />
          )}

          <CardDivider />

          <Button
            color={secondaryColor}
            title="Select File"
            onPress={pickFile}
          />
          <CardDivider />
          <Button color={secondaryColor} title="Clear" onPress={clearUpload} />
        </Card>
        <Card>
          <Button
            disabled={!mediaFile.uri || errors.title}
            color={secondaryColor}
            title="Upload"
            onPress={handleSubmit(uploadFile)}
          />
          {isLoading && <ActivityIndicator size="large" />}
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
};

Upload.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default Upload;
