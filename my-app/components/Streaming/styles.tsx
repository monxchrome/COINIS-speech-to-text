import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  Streaming: {
    marginTop: 25,
    backgroundColor: 'white',
    borderColor: '#E7E7E7',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 30,
    width: 350,
    height: 150,
  },
  Text: {
    paddingLeft: 15,
    marginTop: 30,
    color: '#459DFF',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 12,
  },
  ViewText: {
    paddingBottom: 20,
    borderColor: '#E7E7E7',
    borderStyle: 'solid',
    borderBottomWidth: 1,
  },
  Button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#548DC7',
    width: 300,
    height: 40,
    borderRadius: 30,
  },
  ButtonText: {
    paddingRight: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  ButtonView: {
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
