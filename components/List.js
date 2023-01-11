import {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {mediaUrl} from '../utils/variables';
import ListItem from './ListItem';

const List = () => {
  const [mediaArray, setMediaArray] = useState([]);

  const loadMedia = async () => {
    //  try/catch on await
    try {
      const response = await fetch(mediaUrl);
      const json = await response.json();

      //  Get the extra data including the thumbnails of every file got from the server.
      const media = await Promise.all(
        json.map(async (file) => {
          const fileResponse = await fetch(mediaUrl + file.file_id);
          return await fileResponse.json();
        })
      );

      setMediaArray(media);
    } catch (error) {
      console.error('LIST, LOAD_MEDIA', error);
    }
  };

  //  Run loadMedia only on initial load of this component to stop infinite looping
  useEffect(() => {
    loadMedia();
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
