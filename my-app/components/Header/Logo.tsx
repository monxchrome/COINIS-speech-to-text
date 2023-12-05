import { Image, View } from 'react-native';
import styles from './styles';

const Logo = (props: any) => {
  return (
    <View>
      <Image
        style={styles.logo}
        source={{
          uri: 'https://ictcortex.me/wp-content/uploads/2021/04/coinis-logo.png',
        }}
      />
    </View>
  );
};

export default Logo;
