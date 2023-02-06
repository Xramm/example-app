import React, {useEffect, useRef, useState} from 'react';
import {Image} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {SingleStyles} from '../components/Styles';
import {Card, Text} from '@rneui/themed';
import {CardTitle} from '@rneui/base/dist/Card/Card.Title';
import {CardDivider} from '@rneui/base/dist/Card/Card.Divider';
import {Video} from 'expo-av';
import {useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Single = ({route}) => {
  console.log(route.params);
  const {
    title,
    description,
    filename,
    time_added: t,
    media_type: type,
    screenshot,
    user_id: userId,
  } = route.params;

  const [owner, setOwner] = useState({});
  const video = useRef(null);
  const {getUserById} = useUser();

  const loadOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setOwner(await getUserById(userId, token));
    } catch (error) {
      console.error('Single, Single: ', error);
    }
  };

  useEffect(() => {
    loadOwner();
  }, []);

  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <CardDivider />
      <CardTitle>{t}</CardTitle>
      <CardDivider />
      {type === 'image' ? (
        <Image
          style={SingleStyles.image}
          source={{uri: uploadsUrl + filename}}
        />
      ) : (
        <Video
          ref={video}
          source={{uri: uploadsUrl + filename}}
          style={{width: '100%', height: 200}}
          useNativeControls
          resizeMode="contain"
          isLooping
          usePoster
          posterSource={{uri: uploadsUrl + screenshot}}
          onError={(error) => {
            console.log('Single, Single: ' + error);
          }}
        />
      )}
      <CardDivider />
      <Text>{description}</Text>
      <CardDivider />
      <Text>
        {owner.username} {owner.full_name && '(' + owner.full_name + ')'}
      </Text>
    </Card>
  );
};

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
