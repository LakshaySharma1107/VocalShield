import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Helper function to format milliseconds to mm:ss
const formatTime = (millis) => {
  if (!millis || millis < 0) return '00:00';
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function RecordingTimer({ isRecording, duration = 0 }) {
  const formattedDuration = formatTime(duration);
  return (
    <View style={styles.timerContainer}>
      {isRecording ? (
        <Text style={styles.timerText}>{formattedDuration}</Text>
      ) : (
        <Text style={styles.placeholderText}>Not Recording</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
    fontFamily: 'Poppins',
  },
  placeholderText: {
    fontSize: 24,
    color: '#808080',
    fontFamily: 'Poppins',
  },
});
