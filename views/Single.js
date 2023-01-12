import React from 'react';
import {StyleSheet, SafeAreaView, Text, Image} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';

const Single = ({route}) => {
  console.log(route.params);
  const {title, description, filename, time_added: t} = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <Text>{title}</Text>
      <Image style={styles.image} source={{uri: uploadsUrl + filename}} />
      <Text>{t}</Text>
      <Text>{description}</Text>
    </SafeAreaView>
  );
};

Single.propTypes = {
  route: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  image: {
    width: 200,
    height: 300,
  },
});

export default Single;
