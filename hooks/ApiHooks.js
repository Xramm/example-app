import {useEffect, useState} from 'react';
import {mediaUrl} from '../utils/variables';

const useMedia = () => {
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
      console.error('ApiHooks, loadMedia', error);
    }
  };

  //  Run loadMedia only on initial load of this component to stop infinite looping
  useEffect(() => {
    loadMedia();
  }, []);

  return {mediaArray};
};

export {useMedia};
