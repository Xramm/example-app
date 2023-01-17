import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useContext} from 'react';
import {StyleSheet, SafeAreaView, Text, Button} from 'react-native';
import {secondaryColor} from '../components/ColorPalette';
import {MainContext} from '../contexts/MainContext';

const Profile = () => {
  const {setIsLoggedIn} = useContext(MainContext);
  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile</Text>
      <Button
        color={secondaryColor}
        title="Logout"
        onPress={async () => {
          console.log('Logging out!');
          setIsLoggedIn(false);
          try {
            await AsyncStorage.clear();
          } catch (error) {
            console.warn('Error clearing async storage..', error);
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
});

export default Profile;
