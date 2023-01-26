import AsyncStorage from '@react-native-async-storage/async-storage';
import {CardDivider} from '@rneui/base/dist/Card/Card.Divider';
import {CardImage} from '@rneui/base/dist/Card/Card.Image';
import {CardTitle} from '@rneui/base/dist/Card/Card.Title';
import {ListItemTitle} from '@rneui/base/dist/ListItem/ListItem.Title';
import {Card, Icon, ListItem, Button} from '@rneui/themed';
import React, {useContext, useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {secondaryColor} from '../components/ColorPalette';
import ProfileEditForm from '../components/ProfileEditForm';
import {NativeElementsStyles} from '../components/Styles';
import {MainContext} from '../contexts/MainContext';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';

const Profile = () => {
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, user, setUser} = useContext(MainContext);
  const [avatar, setAvatar] = useState('http://placekitten.com/640');
  const [editFormShown, setEditFormShown] = useState(false);

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

  const onShowEditFormsPressed = () => {
    setEditFormShown(!editFormShown);
  };

  return (
    <ScrollView>
      <Card>
        <CardTitle>{user.username}</CardTitle>
        <CardImage
          style={NativeElementsStyles.profilePageProfilePicture}
          source={{uri: uploadsUrl + avatar}}
        />
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
      <Card>
        {editFormShown ? <ProfileEditForm /> : <></>}
        {editFormShown ? <CardDivider /> : <></>}
        <Button
          color={secondaryColor}
          title={editFormShown ? 'Done' : 'Edit Profile'}
          onPress={onShowEditFormsPressed}
        />
      </Card>
    </ScrollView>
  );
};

export default Profile;
