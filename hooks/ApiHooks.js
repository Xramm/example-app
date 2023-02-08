import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {
  appTag,
  favouritesUrl,
  loginUrl,
  mediaUrl,
  tagsUrl,
  usersUrl,
} from '../utils/variables';

const doFetch = async (url, options) => {
  const response = await fetch(url, options);
  const json = await response.json();

  if (!response.ok) {
    const message = json.error
      ? `${json.message}: ${json.error}`
      : json.message;

    throw new Error(message || `${response.status}: ${response.statusText}`);
  }

  return json;
};

const useMedia = (showAllMedia = false, myFilesOnly = false) => {
  const [mediaArray, setMediaArray] = useState([]);
  const {update, user} = useContext(MainContext);
  const {getFilesByTag, postTag} = useTag();

  const loadMedia = async () => {
    //  try/catch on await
    try {
      let json;

      // Optionally show all the recent files in the server
      if (showAllMedia) {
        const response = await fetch(mediaUrl);
        json = await response.json();
      } else {
        json = await getFilesByTag(appTag);
        json = json.reverse();
      }

      // Filter only to user's files if specified
      if (myFilesOnly) {
        json = json.filter((file) => {
          if (file.user_id === user.user_id) {
            return file;
          }
        });
      }

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

  const postMedia = async (fileData, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': token,
      },
      body: fileData,
    };
    try {
      return await doFetch(mediaUrl, options);
    } catch (error) {
      throw new Error('ApiHooks, postMedia: ' + error.message);
    }
  };

  const postMediaWithAppTag = async (fileData, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': token,
      },
      body: fileData,
    };
    try {
      const result = await doFetch(mediaUrl, options);

      const tagData = {file_id: result.file_id, tag: appTag};

      // TODO: Post Tag with the gotten file_id
      const tagResult = await postTag(tagData, token);
      console.log('Apihooks, postMediaWithAppTag: ' + tagResult);

      return result;
    } catch (error) {
      throw new Error('ApiHooks, postMediaWithAppTag: ' + error.message);
    }
  };

  const deleteMedia = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };
    try {
      return await doFetch(mediaUrl + fileId, options);
    } catch (error) {
      throw new Error('ApiHooks, deleteMedia: ' + error.message);
    }
  };

  const putMedia = async (fileId, data, token) => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(data),
    };
    try {
      return await doFetch(mediaUrl + fileId, options);
    } catch (error) {
      throw new Error('ApiHooks, putMedia: ' + error.message);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [update]); // Load all media after upload

  return {mediaArray, postMedia, postMediaWithAppTag, deleteMedia, putMedia};
};

const useAuthentication = () => {
  const postLogin = async (userCredentials) => {
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userCredentials),
    };
    try {
      return await doFetch(loginUrl, options);
    } catch (error) {
      throw new Error('ApiHooks, postLogin: ' + error.message);
    }
  };

  return {postLogin};
};

const useUser = () => {
  const getUserByToken = async (token) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    };
    try {
      return await doFetch(usersUrl + 'user', options);
    } catch (error) {
      throw new Error('ApiHooks, getUserByToken: ' + error.message);
    }
  };

  const postUser = async (userData) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    };
    try {
      return await doFetch(usersUrl, options);
    } catch (error) {
      throw new Error('ApiHooks, postUser: ' + error.message);
    }
  };

  const checkUsername = async (username) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const result = await doFetch(usersUrl + 'username/' + username, options);
      return result.available;
    } catch (error) {
      throw new Error('ApiHooks, checkUser: ' + error.message);
    }
  };

  const changeUser = async (data) => {
    if (data.token === null) {
      console.error('Apihooks, changeUser: Did not pass a token!');
      return;
    }

    const token = data.token;
    delete data.token;

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(data),
    };
    try {
      return await doFetch(usersUrl, options);
    } catch (error) {
      throw new Error('ApiHooks, changeUser: ' + error.message);
    }
  };

  const getUserById = async (id, token) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    };
    try {
      return await doFetch(usersUrl + id, options);
    } catch (error) {
      throw new Error('ApiHooks, getUserById: ' + error.message);
    }
  };

  return {getUserByToken, postUser, checkUsername, changeUser, getUserById};
};

const useTag = () => {
  const getFilesByTag = async (tag) => {
    try {
      return await doFetch(tagsUrl + tag);
    } catch (error) {
      throw new Error('ApiHooks, getFilesByTag: ' + error.message);
    }
  };

  const postTag = async (data, token) => {
    if (token === null) {
      console.error('Apihooks, postTag: Did not pass a token!');
      return;
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(data),
    };
    try {
      return await doFetch(tagsUrl, options);
    } catch (error) {
      throw new Error('ApiHooks, postTag: ' + error.message);
    }
  };

  return {getFilesByTag, postTag};
};

const useFavourite = () => {
  const postFavourite = async (fileId, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify({file_id: fileId}),
    };
    try {
      return await doFetch(favouritesUrl, options);
    } catch (error) {
      throw new Error('ApiHooks, postFavourite: ' + error.message);
    }
  };

  const getFavouritesByFileId = async (fileId) => {
    try {
      return await doFetch(favouritesUrl + 'file/' + fileId);
    } catch (error) {
      throw new Error('ApiHooks, getFavouritesByFileId: ' + error.message);
    }
  };

  const getFavouritesByUser = async (token) => {};

  const deleteFavourite = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };
    try {
      return await doFetch(favouritesUrl + 'file/' + fileId, options);
    } catch (error) {
      throw new Error('ApiHooks, deleteFavourite: ' + error.message);
    }
  };

  return {
    postFavourite,
    getFavouritesByFileId,
    getFavouritesByUser,
    deleteFavourite,
  };
};

export {useMedia, useAuthentication, useUser, useTag, useFavourite};
