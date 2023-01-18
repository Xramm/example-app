import {StyleSheet, Platform, StatusBar} from 'react-native';
import {
  backgroundColor,
  darkTextColor,
  mainColor,
  secondaryColor,
} from './ColorPalette';

const ListStyles = StyleSheet.create({
  ListBackground: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: backgroundColor,
  },
  ListItem: {
    backgroundColor: mainColor,
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10,
    marginRight: 5,
    marginLeft: 5,
    borderRadius: 20,
    borderColor: secondaryColor,
  },
  ListImage: {
    flex: 1,
    height: 300,
    margin: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 80,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 20,
  },
  ListTitle: {
    color: darkTextColor,
    backgroundColor: secondaryColor,
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    fontWeight: 'bold',
    fontSize: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  ListDescription: {
    color: darkTextColor,
    backgroundColor: secondaryColor,
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    borderColor: secondaryColor,
  },
});

const MainStyles = StyleSheet.create({
  NavigationHeader: {
    backgroundColor: secondaryColor,
  },
  NavigationHeaderTitle: {
    color: darkTextColor,
  },
  TabBarStyle: {
    backgroundColor: secondaryColor,
    borderTopColor: backgroundColor,
    borderTopWidth: 1,
  },
  Background: {
    backgroundColor: backgroundColor,
  },
  BasicButton: {
    color: secondaryColor,
  },
});

const SingleStyles = StyleSheet.create({
  background: {
    backgroundColor: backgroundColor,
    flex: 1,
    padding: 5,
  },
  container: {
    backgroundColor: mainColor,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderRadius: 20,
  },
  title: {
    color: darkTextColor,
    backgroundColor: secondaryColor,
    fontWeight: 'bold',
    fontSize: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
  },
  dateText: {
    color: darkTextColor,
    backgroundColor: secondaryColor,
    paddingLeft: 10,
    paddingBottom: 10,
  },
  image: {
    width: '100%',
    height: 300,
    objectFit: 'cover',
    padding: 10,
  },
  descriptionText: {
    color: darkTextColor,
    backgroundColor: secondaryColor,
    flex: 1,
    padding: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});

const SafeAreas = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: backgroundColor,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

export {ListStyles, MainStyles, SafeAreas, SingleStyles};
