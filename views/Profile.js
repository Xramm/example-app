import AsyncStorage from '@react-native-async-storage/async-storage';
import {CardImage} from '@rneui/base/dist/Card/Card.Image';
import {CardTitle} from '@rneui/base/dist/Card/Card.Title';
import {ListItemTitle} from '@rneui/base/dist/ListItem/ListItem.Title';
import {Card, Icon, ListItem} from '@rneui/themed';
import React, {useContext, useEffect, useState} from 'react';
import {Text, Button} from 'react-native';
import {secondaryColor} from '../components/ColorPalette';
import {MainContext} from '../contexts/MainContext';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';

const Profile = () => {
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, user, setUser} = useContext(MainContext);
  const [avatar, setAvatar] = useState('');

  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      setAvatar(avatarArray.pop().filename);
    } catch (error) {
      console.log('Profile, loadAvatar: ' + error);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, []);

  return (
    <Card>
      <CardTitle>{user.username}</CardTitle>
      <CardImage source={{uri: uploadsUrl + avatar}} />
      <ListItem>
        <Icon name="badge"></Icon>
        <ListItemTitle>{user.full_name}</ListItemTitle>
      </ListItem>
      <ListItem>
        <Icon name="mail"></Icon>
        <ListItemTitle>{user.email}</ListItemTitle>
      </ListItem>
      <ListItem>
        <ListItemTitle>{user.time_created}</ListItemTitle>
      </ListItem>
      <Button
        color={secondaryColor}
        title="Logout"
        onPress={async () => {
          console.log('Logging out!');
          setUser({}); // Clear current user
          setIsLoggedIn(false);
          try {
            await AsyncStorage.clear();
          } catch (error) {
            console.warn('Error clearing async storage..', error);
          }
        }}
      />
    </Card>
  );
};

export default Profile;
