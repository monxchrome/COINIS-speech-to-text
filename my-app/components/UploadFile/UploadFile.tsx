import { View, Text } from 'react-native';
import styles from './styles';
import { useAppContext } from '../../contexts/context';
import { useMediaQuery } from '@react-hook/media-query';

const UploadFile = () => {
  const { upload } = useAppContext();
  const isSmallScreen = useMediaQuery('(max-width: 800px)');

  return (
    <View style={styles.TextView}>
      <View>
        <View>
          {upload ? (
            <View style={[null, isSmallScreen && styles.Main]}>
              <Text style={[styles.Text, isSmallScreen && styles.mobileText]}>
                Transcription:
              </Text>
              <Text style={[null, isSmallScreen && styles.Description]}>
                {upload}
              </Text>
            </View>
          ) : (
            <View style={[null, isSmallScreen && styles.Main]}>
              <Text style={[styles.Text, isSmallScreen && styles.mobileText]}>
                Try CoinisAI API for free in seconds.
              </Text>
              <Text style={[null, isSmallScreen && styles.Description]}>
                Access production-ready AI models for speech recognition.
                Quickly test using your own audio or video file.
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default UploadFile;
