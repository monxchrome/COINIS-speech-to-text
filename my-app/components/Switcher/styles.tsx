import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  Switcher: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: 350,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#CCD5DF',
    alignItems: 'center',
  },
  Button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 45,
    backgroundColor: '#ccd5df',
    borderRadius: 30,
  },
  Text: {
    color: '#949ca4',
  },
  Active: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 190,
    height: 45,
    backgroundColor: 'white',
    borderRadius: 30,
  },
  ActiveText: {
    color: '#609fe5',
  },
});

export default styles;
