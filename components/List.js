import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {ListStyles} from './Styles';

const List = ({navigation, showAllMedia}) => {
  const {mediaArray} = useMedia(showAllMedia);
  return (
    <FlatList
      data={mediaArray}
      //  Adding a key to each list item based on their index
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ListItem navigation={navigation} singleMedia={item} />
      )}
      style={ListStyles.ListBackground}
    />
  );
};

List.propTypes = {
  navigation: PropTypes.object,
  showAllMedia: PropTypes.bool,
};

export default List;
