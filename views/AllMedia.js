import List from '../components/List';
import PropTypes from 'prop-types';

const AllMedia = ({navigation}) => {
  console.log('Starting example-app.');
  return <List navigation={navigation} showAllMedia={true} />;
};

AllMedia.propTypes = {
  navigation: PropTypes.object,
};

export default AllMedia;
