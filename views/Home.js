import {SafeAreaView} from 'react-native';
import List from '../components/List';
import SafeViewAndroid from '../components/SafeViewAndroid';

const Home = () => {
  console.log('Starting example-app.');
  return (
    <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
      <List />
    </SafeAreaView>
  );
};

export default Home;
