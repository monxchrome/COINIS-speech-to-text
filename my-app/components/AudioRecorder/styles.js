import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  Main: {
    height: 700,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 750,
    height: 700,
  },
  recordingButton: {
    margin: 10,
    padding: 10,
    backgroundColor: 'red',
  },
  recordingButtonText: {
    color: 'black',
    fontSize: 18,
  },
  TextView: {
    paddingTop: 20,
    paddingLeft: 20,
  },
  Text: {
    color: '#459DFF',
    fontWeight: 'bold',
    fontSize: 30,
  },
  Description: {
    paddingRight: 20,
    paddingBottom: 20,
  },
  isRecordingView: {
    width: 750,
    height: 700,
  },
  mobileIsRecordingView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    width: 400,
  },
  mobileText: {
    color: '#459DFF',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
  },
  mobileDescription: {
    textAlign: 'center',
  },
  mobileContainer: {
    flex: 1,
    width: 400,
    height: 100,
  },
  mobileMain: {
    height: 150,
  },
});
