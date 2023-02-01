import {NativeElementsStyles} from './Styles';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Card, Text} from '@rneui/themed';
import {CardDivider} from '@rneui/base/dist/Card/Card.Divider';
import {CardImage} from '@rneui/base/dist/Card/Card.Image';
import {CardTitle} from '@rneui/base/dist/Card/Card.Title';

const ListItem = (props) => {
  const item = props.singleMedia;
  const navigation = props.navigation;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Single', item);
      }}
    >
      <Card>
        <CardTitle>{item.title}</CardTitle>
        <CardDivider />
        <CardImage
          style={NativeElementsStyles.listItemImage}
          source={{uri: uploadsUrl + item.thumbnails?.w160}}
        />
        <CardDivider />
        <Text>{item.description}</Text>
      </Card>
    </TouchableOpacity>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;
