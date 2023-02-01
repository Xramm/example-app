import List from '../components/List';
import PropTypes from 'prop-types';

// View for the files uploaded using this app only
const Home = ({navigation}) => {
  console.log('Starting example-app.');
  return <List navigation={navigation} />;
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
