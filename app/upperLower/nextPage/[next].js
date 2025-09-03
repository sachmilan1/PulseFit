import React, { useState, useCallback } from 'react';
import { Text, View,ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import allWorkouts from '../../workouts.json';

export default function Show(){
    const {option} = useLocalSearchParams();
    useFocusEffect(
        useCallback(()=>{
            console.log(option)
        },
    [option])
    );
    return(
        <View>
            <Text>{option}</Text>
        </View>
    )
}