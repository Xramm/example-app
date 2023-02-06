import React, {useEffect, useRef, useState} from 'react';
import {Image} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {SingleStyles} from '../components/Styles';
import {Button, Card, Text} from '@rneui/themed';
import {CardTitle} from '@rneui/base/dist/Card/Card.Title';
import {CardDivider} from '@rneui/base/dist/Card/Card.Divider';
import {Video} from 'expo-av';
import {useFavourite, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {secondaryColor} from '../components/ColorPalette';

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
    file_id: fileId,
  } = route.params;

  const [owner, setOwner] = useState({});
  const [likes, setLikes] = useState([]);
  const [userLikesIt, setUserLikesIt] = useState(false);

  const video = useRef(null);
  const {getUserById} = useUser();
  const {getFavouritesByFileId, postFavourite, deleteFavourite} = useFavourite();

  const getOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setOwner(await getUserById(userId, token));
    } catch (error) {
      console.error('Single, getOwner: ', error);
    }
  };

  const getLikes = async () => {
    try {
      const likes = await getFavouritesByFileId(fileId);
      console.log('Likes: ' + likes);
      setLikes(likes);
    } catch (error) {
      console.error('Single, getLikes: ', error);
    }
  };

  const likeFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await postFavourite(fileId, token);
      console.log('Single, likeFile: ' + result);
      getLikes();
      setUserLikesIt(true);
    } catch (error) {
      console.error('Single, likeFile: ', error);
    }
  };

  const removeLikeFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = deleteFavourite(fileId, token);
      console.log('Single, removeLikeFile: ' + result);
      getLikes();
      setUserLikesIt(false);
    } catch (error) {
      console.error('Single, likeFile: ', error);
    }
  };

  useEffect(() => {
    getOwner();
    getLikes();
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

      {userLikesIt ? (
        <Button color={secondaryColor} onPress={removeLikeFile}>
          Remove Like
        </Button>
      ) : (
        <Button color={secondaryColor} onPress={likeFile}>
          Like
        </Button>
      )}

      <Text>Likes: {likes.length}</Text>
    </Card>
  );
};

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
