import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './styles';
import { useEffect, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { sendFileToServer } from './api';
import { useAppContext } from '../../contexts/context';

const BarUploadFile = () => {
  const [file, setFile] = useState(null);

  const { setUpload } = useAppContext();

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
    setFile(result.assets[0].file);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (file) {
          const transcription = await sendFileToServer(file);
          setUpload(transcription);
        }
      } catch (error) {
        console.error('Error while sending file:', error);
      }
    };

    fetchData();
  }, [file]);

  return (
    <View style={styles.Upload}>
      <View style={styles.ViewText}>
        <Text style={styles.TextBar}>Start transcribing by audio file:</Text>
      </View>
      <View style={styles.UploadView}>
        <TouchableOpacity style={styles.Image} onPress={pickDocument}>
          <Image source={require('../../assets/Upload.svg')} />
          <Text style={styles.FileText}>Upload your file</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.UploadButton}>
        <Text style={styles.TextButton}>Transcribe</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BarUploadFile;
