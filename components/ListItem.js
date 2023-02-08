import {NativeElementsStyles} from './Styles';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {ButtonGroup, Card, Text} from '@rneui/themed';
import {CardDivider} from '@rneui/base/dist/Card/Card.Divider';
import {CardImage} from '@rneui/base/dist/Card/Card.Image';
import {CardTitle} from '@rneui/base/dist/Card/Card.Title';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';

const ListItem = (props) => {
  const {user} = useContext(MainContext);

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
        <CardDivider />
        <Text>{item.description}</Text>
        {item.user_id === user.user_id && (
          <ButtonGroup
            buttons={['Modify', 'Delete']}
            onPress={(index) => {
              if (index === 0) {
                console.log('Modify Pressed');
              } else {
                console.log('Delete Pressed');
              }
            }}
          />
        )}
      </Card>
    </TouchableOpacity>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;
