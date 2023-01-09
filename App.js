import {StatusBar} from 'expo-status-bar';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import SafeViewAndroid from './components/SafeViewAndroid';
import List from './components/List';

const App = () => {
  console.log('Starting example-app.');
  return (
    <>
      <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
        <List />
      </SafeAreaView>
      <StatusBar style="auto" />
    </>
  );
};

export default App;
