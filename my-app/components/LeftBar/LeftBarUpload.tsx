import { View } from 'react-native';
import styles from './styles';
import Switcher from '../Switcher/Switcher';
import BarUploadFile from '../UploadFile/BarUploadFile';

const LeftBar = () => {
  return (
    <View style={styles.LeftBar}>
      <Switcher />
      <BarUploadFile />
    </View>
  );
};

export default LeftBar;
