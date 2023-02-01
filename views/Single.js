import React from 'react';
import {Image} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {SingleStyles} from '../components/Styles';
import {Card, Text} from '@rneui/themed';
import {CardTitle} from '@rneui/base/dist/Card/Card.Title';
import {CardDivider} from '@rneui/base/dist/Card/Card.Divider';

const Single = ({route}) => {
  console.log(route.params);
  const {title, description, filename, time_added: t} = route.params;

  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <CardDivider />
      <CardTitle>{t}</CardTitle>
      <CardDivider />
      <Image style={SingleStyles.image} source={{uri: uploadsUrl + filename}} />
      <CardDivider />
      <Text>{description}</Text>
    </Card>
  );
};

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
