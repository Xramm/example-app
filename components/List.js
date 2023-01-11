import {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import ListItem from './ListItem';

const List = () => {
  const url =
    'https://raw.githubusercontent.com/mattpe/wbma/master/docs/assets/test.json';
  const [mediaArray, setMediaArray] = useState([]);

  const loadMedia = async () => {
    const response = await fetch(url);
    const json = await response.json();
    setMediaArray(json);
  };

  //  Run loadMedia only on initial load of this component to stop infinite looping
  useEffect(() => {
    try {
      loadMedia();
    } catch {
      console.error('LIST, LOAD_MEDIA Failed to load media.');
    }
  }, []);

  console.log('LIST, LOAD_MEDIA', mediaArray);

  return (
    <FlatList
      data={mediaArray}
      //  Adding a key to each list item based on their index
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => <ListItem singleMedia={item} />}
    />
  );
};

export default List;
