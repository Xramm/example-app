import {ListStyles} from './Styles';
import {Text, TouchableOpacity, Image} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';

const ListItem = (props) => {
  const item = props.singleMedia;
  const navigation = props.navigation;
  return (
    <TouchableOpacity
      style={ListStyles.ListItem}
      onPress={() => {
        navigation.navigate('Single', item);
      }}
    >
      <Text style={ListStyles.ListTitle}>{item.title}</Text>
      <Text style={ListStyles.ListDescription}>{item.description}</Text>
      <Image
        style={ListStyles.ListImage}
        source={{uri: uploadsUrl + item.thumbnails?.w160}}
      />
    </TouchableOpacity>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;
