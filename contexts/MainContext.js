import React from 'react';
import PropTypes from 'prop-types';
import {useState} from 'react';

const MainContext = React.createContext({});

const MainProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  return (
    <MainContext.Provider value={{isLoggedIn, setIsLoggedIn, user, setUser}}>
      {props.children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node,
};

export {MainContext, MainProvider};
