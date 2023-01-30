import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {loginUrl, mediaUrl, tagsUrl, usersUrl} from '../utils/variables';

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

const useMedia = () => {
  const [mediaArray, setMediaArray] = useState([]);
  const {update} = useContext(MainContext);

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

  useEffect(() => {
    loadMedia();
  }, [update]); // Load all media after upload

  return {mediaArray, postMedia};
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

  return {getUserByToken, postUser, checkUsername, changeUser};
};

const useTag = () => {
  const getFilesByTag = async (tag) => {
    try {
      return await doFetch(tagsUrl + tag);
    } catch (error) {
      throw new Error('ApiHooks, getFilesByTag: ' + error.message);
    }
  };

  return {getFilesByTag};
};

export {useMedia, useAuthentication, useUser, useTag};
