import { View } from 'react-native';
import LeftBarUpload from '../../components/LeftBar/LeftBarUpload';
import UploadFile from '../../components/UploadFile/UploadFile';
import { StyleSheet, Platform } from 'react-native';
import { AppProvider } from '../../contexts/context';
import { useMediaQuery } from '@react-hook/media-query';

const UploadFilePage = () => {
  const isSmallScreen = useMediaQuery('(max-width: 800px)');

  return (
    <AppProvider>
      <View style={[styles.container, !isSmallScreen && styles.containerWeb]}>
        {Platform.OS === 'web' ? (
          <>
            {isSmallScreen ? (
              <>
                <UploadFile />
                <LeftBarUpload />
              </>
            ) : (
              <>
                <LeftBarUpload />
                <UploadFile />
              </>
            )}
          </>
        ) : (
          <>
            <UploadFile />
            <LeftBarUpload />
          </>
        )}
      </View>
    </AppProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#fff',
  },
  containerWeb: {
    flexDirection: 'row',
  },
});

export default UploadFilePage;
