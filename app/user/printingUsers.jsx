import React, { useState, useCallback } from 'react';
import { Text, View,ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import allWorkouts from '../workouts.json';
import * as SQLite from 'expo-sqlite';

export default function See(){

    const[users, setUsers]= useState([]);
    const[db,setDb] = useState(null);

    const initiateDatabase= async()=>{
        const database = await SQLite.openDatabaseAsync('Fitness.db');
        setDb(database);

        const row = await database.getAllAsync('Select * from users');
        setUsers(row);
    }

    useFocusEffect(
        useCallback(()=>{
            initiateDatabase();
        },[])
    )

    return(
        <View style={{backgroundColor:'white'}}>
            <ScrollView>
                {users.map((item)=>(
                    <Text>Name: {item.userName}</Text>
                ))}
            </ScrollView>
        </View>
    )
}