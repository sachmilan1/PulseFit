import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import AppStyles from './AppStyles';

const App = () => {
  return (
    <View style={AppStyles.container}>
      <Text style={AppStyles.title}>Are you ready to get fit!!!</Text>

      <TouchableOpacity style={AppStyles.button}>
        <Text style={AppStyles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={AppStyles.button}
      onPress={()=>{
        router.replace('/user/signUp')
      }}>
        <Text style={AppStyles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={AppStyles.button}
      onPress={async()=>{router.push({pathname:'../type'})}}>
        <Text style={AppStyles.buttonText}>Guest</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
