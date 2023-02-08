import React, {useContext, useEffect, useRef, useState} from 'react';
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
import * as ScreenOrientation from 'expo-screen-orientation';
import {MainContext} from '../contexts/MainContext';

const Single = ({route}) => {
  console.log(route.params);
  const {
    title,
    description,
    filename,
    time_added: t,
    media_type: type,
    user_id: userId,
    file_id: fileId,
  } = route.params;

  const {user} = useContext(MainContext);
  const [owner, setOwner] = useState({});
  const [likes, setLikes] = useState([]);
  const [userLikesIt, setUserLikesIt] = useState(false);

  const video = useRef(null);
  const {getUserById} = useUser();
  const {getFavouritesByFileId, postFavourite, deleteFavourite} =
    useFavourite();

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
      for (const like of likes) {
        if (like.user_id === user.user_id) {
          setUserLikesIt(true);
          break;
        }
      }
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

  const unlock = async () => {
    try {
      await ScreenOrientation.unlockAsync();
    } catch (error) {
      console.error('Single, unlock: ' + error);
    }
  };

  const lock = async () => {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } catch (error) {
      console.error('Single, unlock: ' + error);
    }
  };

  useEffect(() => {
    getOwner();
    getLikes();
    unlock();

    return () => {
      lock();
    };
  }, []);

  const showVideoInFullscreen = async () => {
    try {
      if (video) await video.presentFullscreenPlayer();
    } catch (error) {
      console.error('Single, showVideoInFullscreen: ' + error);
    }
  };

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
