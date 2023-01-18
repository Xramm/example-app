import React from 'react';
import {View, Text, Image} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {SingleStyles} from '../components/Styles';

const Single = ({route}) => {
  console.log(route.params);
  const {title, description, filename, time_added: t} = route.params;
  return (
    <View style={SingleStyles.background}>
      <View style={SingleStyles.container}>
        <Text style={SingleStyles.title}>{title}</Text>
        <Text style={SingleStyles.dateText}>{t}</Text>
        <Image
          style={SingleStyles.image}
          source={{uri: uploadsUrl + filename}}
        />
        <Text style={SingleStyles.descriptionText}>{description}</Text>
      </View>
    </View>
  );
};

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
