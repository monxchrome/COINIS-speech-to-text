import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  Text: {
    width: 688,
    color: '#459DFF',
    fontWeight: 'bold',
    fontSize: 30,
  },
  Main: {
    height: 150,
    justifyContent: 'center',
  },
  Description: {
    textAlign: 'center',
    paddingBottom: 20,
  },
  mobileText: {
    width: 400,
    color: '#459DFF',
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
  },
  TextView: {
    paddingTop: 20,
    paddingLeft: 20,
  },
  Upload: {
    marginTop: 25,
    backgroundColor: 'white',
    borderColor: '#E7E7E7',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 30,
    width: 350,
    height: 670,
  },
  ViewText: {
    paddingBottom: 20,
  },
  TextBar: {
    paddingLeft: 15,
    marginTop: 30,
    color: '#459DFF',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 12,
  },
  UploadView: {
    marginLeft: 25,
    width: 300,
    height: 100,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#b8b8b8',
    borderRadius: 30,
  },
  Image: {
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  FileText: {
    color: '#666666',
  },
  UploadButton: {
    backgroundColor: '#538dc7',
    width: 300,
    height: 50,
    borderRadius: 30,
    marginTop: 20,
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextButton: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default styles;
