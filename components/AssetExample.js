import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Animated,
  Pressable,
  Switch,
  ImageBackground,
  FlatList,
  StatusBar,
} from 'react-native';

export default function AssetExample(theList) {
  
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        Drawing Game Tools
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  paragraph: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logo: {
    height: '30%',
    width: '100%',
  }
});
