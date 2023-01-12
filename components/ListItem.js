import CatListStyles from './CatListStyles';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';

const ListItem = (props) => {
  const item = props.singleMedia;
  const navigation = props.navigation;
  return (
    <TouchableOpacity
      style={CatListStyles.CatListItem}
      onPress={() => {
        navigation.navigate('Single', item);
      }}
    >
      <Image
        style={CatListStyles.CatListImage}
        source={{uri: uploadsUrl + item.thumbnails?.w160}}
      />
      <View>
        <Text style={CatListStyles.CatListTitle}>{item.title}</Text>
        <Text style={CatListStyles.CatListText}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;
