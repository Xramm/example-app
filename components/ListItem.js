import CatListStyles from './CatListStyles';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import PropTypes from 'prop-types';

const ListItem = (props) => {
  const item = props.singleMedia;
  return (
    <TouchableOpacity style={CatListStyles.CatListItem}>
      <Image
        style={{width: 100, height: 100}}
        source={{uri: item.thumbnails.w160}}
      />
      <View>
        <Text>{item.title}</Text>
        <Text>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

ListItem.PropTypes = {
  singleMedia: PropTypes.object,
};

export default ListItem;
