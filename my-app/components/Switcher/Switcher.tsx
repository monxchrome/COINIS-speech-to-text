import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import styles from './styles';
import * as Linking from 'expo-linking';

const Switcher = () => {
  const url = Linking.useURL();

  return (
    <View style={styles.Switcher}>
      <Link href={'/'}>
        <TouchableOpacity
          style={[
            url === 'http://localhost:8081/' ? styles.Active : styles.Button,
          ]}
        >
          <Text
            style={[
              url === 'http://localhost:8081/' ? styles.ActiveText : null,
            ]}
          >
            Streaming
          </Text>
        </TouchableOpacity>
      </Link>
      <Link href="/uploadFilePage/">
        <TouchableOpacity
          style={[
            url === 'http://localhost:8081/uploadFilePage/'
              ? styles.Active
              : styles.Button,
          ]}
        >
          <Text
            style={[
              url === 'http://localhost:8081/uploadFilePage/'
                ? styles.ActiveText
                : null,
            ]}
          >
            Upload
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default Switcher;
