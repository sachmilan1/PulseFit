import React, { useState, useCallback } from 'react';
import { Text, View,ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import allWorkouts from '../workouts.json';

export default function SeeWorkouts() {
  const { constraint } = useLocalSearchParams();
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const heading = constraint.toUpperCase() || 'No Constraint';

//   console.log('Constraint:', constraint);
//   console.log('Workout data sample:', allWorkouts[0]);

  useFocusEffect(
    useCallback(() => {
      if (!constraint) return;

      const lowerConstraint = constraint.toLowerCase();

      const filtered = allWorkouts.filter((workout) =>

        //Here .some checks if any tag satisfy the condition,
        //  wwe are using this because tags is an array
        workout.tags.some(tag =>
          tag.toLowerCase().includes(lowerConstraint)
        )
      );

      setFilteredWorkouts(filtered);
    }, [constraint])
  );

  return (
    <ScrollView>
    <View style={{ padding: 16, backgroundColor: '#fff', flex: 1 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        {heading}
      </Text>

      {filteredWorkouts.length === 0 && (
        <Text style={{ color: 'gray', fontSize: 16 }}>
          No workouts found for "{heading}"
        </Text>
      )}

      {filteredWorkouts.map((item, index) => (
        <View key={index} style={{ marginVertical: 12 }}>
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
    </View>
    </ScrollView>
  );
}
