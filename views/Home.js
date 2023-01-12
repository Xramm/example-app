import {SafeAreaView} from 'react-native';
import List from '../components/List';
import SafeViewAndroid from '../components/SafeViewAndroid';
import PropTypes from 'prop-types';

const Home = ({navigation}) => {
  console.log('Starting example-app.');
  return (
    <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
      <List navigation={navigation} />
    </SafeAreaView>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
