import {
    Text,
    TextInput,
    View,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ImageBackground,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Modal,
  } from 'react-native';
  import * as SQLite from 'expo-sqlite';
  import { useFocusEffect, router } from 'expo-router';
  import { useCallback, useState } from 'react';
  import { getUserName } from '../../lib/session';

  export default function AfterSignIn(){

    const [userName, setUserName] = useState('');

    useFocusEffect(
        useCallback(()=>{
            let name = getUserName();
            setUserName(name);

        },[])
    )

    return(
        <View style={{backgroundColor:"white"}}>
            <Text>{userName}</Text>
        </View>
    )
  }
