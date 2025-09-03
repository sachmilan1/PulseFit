import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AppStyles from './AppStyles';
import { router } from 'expo-router';

const Type = () => {
  return (
    <View style={[AppStyles.container, styles.container]}>
      <Text style={AppStyles.title}>
        How do you want to look at your workouts?
      </Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={AppStyles.button}>
          <Text style={AppStyles.buttonText}>Muscle Type</Text>
        </TouchableOpacity>

        <TouchableOpacity style={AppStyles.button}>
          <Text style={AppStyles.buttonText}>Workout Type</Text>
        </TouchableOpacity>

        <TouchableOpacity style={AppStyles.button}
          onPress={async()=>{
            router.replace({
              pathname:'/upperLower/option',
            })
          }}
        >
          <Text style={AppStyles.buttonText}>Upper-Lower</Text>
        </TouchableOpacity>

        <TouchableOpacity style={AppStyles.button}
         onPress={async()=>{
          router.replace({
            pathname: '/filter/[constraint]',
            params: { constraint: 'warmup' },
          });
          }}>
          <Text style={AppStyles.buttonText}>Warm-Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={AppStyles.button}
        onPress={async()=>{
          router.replace({
            pathname: '/filter/[constraint]',
            params: { constraint: 'aerobic' },
          });
        }}>
          <Text style={AppStyles.buttonText}>Aerobic</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Type;

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
  },
});
