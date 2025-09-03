import React, { useState, useCallback, useEffect } from 'react';
import { Text, View, ScrollView,Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import allWorkouts from '../../workouts.json';

export default function ShowWorkouts() {
  const { constraint } = useLocalSearchParams();
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const heading = constraint.toUpperCase() || 'WORKOUTS';
  const [main, setmain] = useState("");

  console.log("inside function");
  // console.log('Constraint:', constraint);
  // console.log('Workout data sample:', allWorkouts[0]);

  useFocusEffect(
    useCallback(() => {
      console.log("useFocusEffect is running");
      
      // Log every region
      allWorkouts.forEach(w => console.log(w.name, '=>', w.region));
  
      const filtered = allWorkouts.filter(
        (workout) => workout.region=== constraint
      );
  
      setFilteredWorkouts(filtered);
    }, [constraint])

  );

  // useEffect(() => {
  //   console.log("Filtered Workouts:", filteredWorkouts.map(w => w.name));
  // }, [filteredWorkouts]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        {heading}
      </Text>

      {filteredWorkouts.length === 0 && (
        <Text style={{ color: 'gray', fontSize: 16 }}>
          No workouts found for "{heading}"
        </Text>
      )}

      {filteredWorkouts.map((item, index) => (
        <View key={index} style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: 'bold' }}>Name: {item.name}</Text>
          <Text>Region: {item.region}</Text>
          <Text>Type: {item.type}</Text>
          <Text>Description: {item.description}</Text>
          <Text>Instructions: {item.instructions}</Text>
          <Text>Muscle: {item.muscle}</Text>
          <Text>Body Part: {item.bodyPart}</Text>
          <Text>Tags: {item.tags?.join(', ') || 'None'}</Text>
        </View>
      ))}
      <Text>{main}</Text>
    </ScrollView>
  );

 
}


