import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DocumentPicker from 'react-native-document-picker';
import Mic from './mic.png'; // Ensure the mic image is in the correct path
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RecordingTimer from './Recordingtimer'; // Make sure this path is correct
import { PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import ProcessPage from './Processpage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NavigationContainer from '@react-navigation/native';
import { setFilename, getFilename, setFilePath, setFileUrl ,setFileUri, getFileUrluploaded , setFileAudioUID, getFileAudioUID} from './filepath'; // Import the setter function


// Function to request permission
const requestAudioPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Audio permission granted');
    } else {
      console.log('Audio permission denied');
      Alert.alert('Permission required', 'You need to grant audio recording permission.');
      return false;
    }
  }
  return true;
};

const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'App needs access to storage to save your recordings',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Storage permission granted');
    } else {
      console.log('Storage permission denied');
      Alert.alert('Permission required', 'You need to grant storage permission.');
      return false;
    }
  }
  return true;
};

const TabNav = createBottomTabNavigator();
const audioRecorderPlayer = new AudioRecorderPlayer();

export default function AudioInputButton() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0); // Default initialized
  const [audioFile, setAudioFile] = useState(null);
  const navigation = useNavigation();
  
  const resetState = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingDuration(0);
    setAudioFile(null);
    // Reset other state variables if necessary
  };
  
  const openFileManager = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });
      setAudioFile(res[0]);
      const fileUri = res[0].uri; // Get the file URI
      setFilename(fileUri);
      setFileAudioUID(Date.now());
      console.log("After Setting", getFileAudioUID());
      
      Alert.alert('File selected', `File: ${fileUri}`);
      console.log('FILE NAME: ', getFilename());
      
      setFileUrl(getFilename());
      console.log(getFileUrluploaded());
  
      // resetState(); // Reset state before navigating again
      // navigation.navigate('Process'); // Navigate after file selection
      navigation.reset({
        index: 0,
        routes: [{ name: 'Process' }],
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the file picker');
      } else {
        console.error('File Picker Error:', err);
        Alert.alert('Error', 'Could not open file manager.');
      }
    }
  };
  

  const startRecording = async () => {
    const hasPermission = await requestAudioPermission();
    if (!hasPermission) return;
    if (isRecording) {
      Alert.alert('Error', 'Recording is already in progress.');
      return;
    }
    try {
      const result = await audioRecorderPlayer.startRecorder();
      setIsRecording(true);
      setIsPaused(false); // Reset paused state when starting recording
      console.log('Recording started:', result);
      audioRecorderPlayer.addRecordBackListener((e) => {
        const currentPosition = audioRecorderPlayer.mmss(e.currentPosition);
        setRecordingDuration(e.currentPosition); // Ensure a valid duration
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', 'Could not start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!isRecording) {
      Alert.alert('Error', 'No recording in progress.');
      return;
    }
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setIsRecording(false);
      setIsPaused(false);
      console.log('Recording stopped:', result);
      
      // Ensure the file path is correct (file:/// format)
      const fileUri = result; // This should be file:///path/to/file
      console.log("File saved at:", fileUri);

      setFileUri(fileUri);
      Alert.alert('Recording saved', `Audio file saved at: ${fileUri}`);
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', 'Could not stop recording. Please try again.');
    }
    navigation.navigate('Process');
  };

  const pauseRecording = async () => {
    if (!isRecording) {
      Alert.alert('Error', 'No recording in progress to pause.');
      return;
    }
    if (isPaused) {
      Alert.alert('Error', 'Recording is already paused.');
      return;
    }
    try {
      await audioRecorderPlayer.pauseRecorder();
      setIsPaused(true); // Update state to indicate the recording is paused
      console.log('Recording paused');
    } catch (error) {
      console.error('Error pausing recording:', error);
      Alert.alert('Error', 'Could not pause recording. Please try again.');
    }
  };

  const resumeRecording = async () => {
    if (!isPaused) {
      Alert.alert('Error', 'Recording is already in progress.');
      return;
    }
    try {
      await audioRecorderPlayer.resumeRecorder();
      setIsPaused(false); // Reset pause state
      console.log('Recording resumed');
    } catch (error) {
      console.error('Error resuming recording:', error);
      Alert.alert('Error', 'Could not resume recording. Please try again.');
    }
  };

  return (
  
    <SafeAreaView style={styles.safeArea}>
      <RecordingTimer isRecording={isRecording} duration={recordingDuration} />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={isPaused ? resumeRecording : pauseRecording}
        >
          <Ionicons name={isPaused ? "play" : "pause"} size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={startRecording} disabled={isRecording}>
          <Image source={Mic} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={stopRecording} disabled={!isRecording}>
          <Ionicons name="stop" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>Start Recording</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={openFileManager}>
          <Text style={styles.buttonText}>Open From File Manager</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: isRecording ? '#2C4EC5' : '#fff' }]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text style={[styles.buttonText, { color: isRecording ? '#fff' : '#2C4EC5' }]}>
            {isRecording ? 'Stop Recording' : 'Start New Recording'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    marginTop: '25%',
  },
  text: {
    fontFamily: "Poppins",
    fontSize: 24,
    color: "black",
    marginVertical: '5%',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '90%',
    padding: '2%',
    marginBottom: 10,
  },
  button: {
    padding: '5%',
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 3,
    backgroundColor: 'blue',
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'Poppins',
    textAlign: 'center',
    color: '#fff',
  },
  image: {
    height: 200,
    width: 200,
  },
  controlButton: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#2C4EC5',
    padding: 5,
    borderRadius: 25,
    elevation: 3,
    width: 60,
  },
  activeButton: {
    backgroundColor: '#2C4EC5',
  },
  inactiveButton: {
    backgroundColor: '#D3D3D3',
  },
  activeText: {
    color: '#fff',
  },
  inactiveText: {
    color: '#D3D3D3',
  },
});

