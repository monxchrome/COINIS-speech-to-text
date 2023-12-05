import styles from './styles';
import Switcher from '../Switcher/Switcher';
import Streaming from '../Streaming/Streaming';
import { SafeAreaView } from 'react-native-safe-area-context';

const LeftBar = () => {
  return (
    <SafeAreaView style={styles.LeftBar}>
      <Switcher />
      <Streaming />
    </SafeAreaView>
  );
};

export default LeftBar;
