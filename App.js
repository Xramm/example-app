import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';

const App = () => {
  console.log('Starting example-app.');
  return (
    <View style={styles.container}>
      <Text>Test test test!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
