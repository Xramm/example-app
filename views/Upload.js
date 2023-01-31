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
import React, {useContext, useRef, useState} from 'react';
import missingImage from '../img/missing.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';

const Upload = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({defaultValues: {title: '', description: ''}});
  const {postMediaWithAppTag} = useMedia();

  const {update, setUpdate} = useContext(MainContext);

  const [mediaFile, setMediaFile] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const titleInput = useRef();
  const descriptionInput = useRef();

  const pickFile = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    console.log(result);

    if (!result.canceled) {
      setMediaFile(result.assets[0]);
    }
  };

  const clearUpload = () => {
    titleInput.current.clear();
    descriptionInput.current.clear();
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
                ref={titleInput}
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
                ref={descriptionInput}
                placeholder="Description"
                onblur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.description && errors.description.message}
              />
            )}
            name="description"
          />

          <Card.Image
            source={mediaFile.uri ? {uri: mediaFile.uri} : missingImage}
          />

          <CardDivider />

          <Button
            color={secondaryColor}
            title="Select Image"
            onPress={pickFile}
          />
          <CardDivider />
          <Button color={secondaryColor} title="Clear" onPress={clearUpload} />
        </Card>
        <Card>
          <Button
            disabled={!mediaFile.uri}
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
