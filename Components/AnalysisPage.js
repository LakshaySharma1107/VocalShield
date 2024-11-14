import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Sound from 'react-native-sound'; // To handle audio playback
import RNFS from 'react-native-fs'; // To handle file system operations
import { getFileAudioUID } from './filepath';
import Mic from './mic.png'; // Assuming you have this image in your project

export default function AnalysisPage({ route }) {
  const { processedAudio } = route.params; // Get the processed audio URL passed from the previous screen
  const [audioPlayer, setAudioPlayer] = useState(null); // Store the audio player instance
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [audioError, setAudioError] = useState(null); // Track any errors related to audio playback
  const [fileName, setFileName] = useState(''); // State to store user input for file name
  const [isPlaying, setIsPlaying] = useState(false); // Track if audio is playing
  const navigation = useNavigation(); // Initialize useNavigation hook

  useEffect(() => {
    if (!processedAudio) {
      Alert.alert("No Audio Input", "No audio input provided. Please check and try again.");
      setIsLoading(false); // Set loading to false if no audio is provided
      return;
    }

    setIsLoading(true);

    // Define the path to save the file in the Downloads folder
    const downloadPath = RNFS.DownloadDirectoryPath + '/muted_audio.wav';

    // Download the processed audio from the server
    RNFS.downloadFile({
      fromUrl: `https://3a1a-103-31-41-153.ngrok-free.app/static/muted_audio_${getFileAudioUID()}.wav`, // The URL where the audio is hosted (Flask server)
      toFile: downloadPath, // Path on the device to save the file in Downloads
    })
      .promise.then(() => {
        // After downloading, initialize the audio player
        const player = new Sound(downloadPath, '', (error) => {
          if (error) {
            setAudioError('Error loading audio.');
            setIsLoading(false);
          } else {
            setAudioPlayer(player);
            setIsLoading(false);
          }
        });
      })
      .catch((err) => {
        setAudioError('Error downloading audio: ' + err.message);
        setIsLoading(false);
      });
  }, [processedAudio]);

  const playAudio = () => {
    if (audioPlayer) {
      audioPlayer.play((success) => {
        if (!success) {
          setAudioError('Error playing audio.');
        }
        setIsPlaying(true); // Audio is playing
      });
    }
  };

  const stopAudio = () => {
    if (audioPlayer) {
      audioPlayer.stop(() => {
        setIsPlaying(false); // Audio stopped
      });
    }
  };

  const handleDownload = () => {
    if (!processedAudio) {
      Alert.alert("No Audio Input", "No audio input provided. Please check and try again.");
      return;
    }

    // Use the custom file name entered by the user or fallback to a default name
    const customFileName = fileName || 'muted_audio';
    const downloadPath = RNFS.DownloadDirectoryPath + `/${customFileName}.wav`;

    // Download the audio file again (this is a simple method; you can enhance it)
    RNFS.downloadFile({
      fromUrl: `http://192.168.0.103:5000/static/muted_audio_${getFileAudioUID()}.wav`, // The URL where the audio is hosted (Flask server)
      toFile: downloadPath, // Path on the device to save the file in Downloads with custom name
    })
      .promise.then(() => {
        alert(`Audio downloaded successfully as ${customFileName}.wav at ${RNFS.DownloadDirectoryPath}!`);
      })
      .catch((err) => {
        setAudioError('Error downloading audio: ' + err.message);
      });
  };

  const handleBack = () => {
    navigation.goBack(); // Go back to the previous screen
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image source={Mic} style={styles.image} />
        <Text style={styles.title}>Processed Audio</Text>

        {/* Display loading state */}
        {isLoading && <Text style={styles.text}>Loading audio...</Text>}

        {/* Display error message if any */}
        {audioError && <Text style={styles.errorText}>{audioError}</Text>}

        {/* Display the processed audio */}
        {processedAudio && !isLoading && !audioError && (
          <>
            <Text style={styles.text}>Processed audio is ready to play:</Text>

            {/* Label for the custom file name */}
            <Text style={styles.inputLabel}>Write File Name (Optional) :</Text>

            {/* Input field for the user to enter a custom file name */}
            <TextInput
              style={styles.input}
              placeholder="Default File Name: Muted_Audio" // Custom placeholder text
              value={fileName}
              onChangeText={setFileName} // Update the state when text changes
              placeholderTextColor="#888" // Light gray color for the placeholder text
            />

            {/* Button to download the audio file */}
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={handleDownload} // Trigger the download when button is pressed
            >
              <Text style={styles.buttonText}>Download Processed Audio</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Audio Control Buttons */}
        <View style={styles.buttonsContainer}>
          {/* Play Button */}
          <TouchableOpacity
            style={[styles.audioButton, { backgroundColor: 'green' }]}
            onPress={playAudio} // Play audio when button is pressed
          >
            <Text style={styles.buttonText}>Play Processed Audio</Text>
          </TouchableOpacity>

          {/* Stop Button */}
          <TouchableOpacity
            style={[styles.audioButton, { backgroundColor: 'red' }]}
            onPress={stopAudio} // Stop audio when button is pressed
          >
            <Text style={styles.buttonText}>Stop Audio</Text>
          </TouchableOpacity>
        </View>

        {/* Back button to return to the previous screen */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Light background color for the whole screen
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: 24,
    color: '#333', // Dark gray text for the title
    marginBottom: 20,
    fontWeight: 'bold',
  },
  text: {
    fontFamily: 'Poppins',
    fontSize: 18,
    color: '#333', // Dark gray text for general content
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Poppins',
    color: '#ffffff', // White text for contrast
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
  },
  audioButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  downloadButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
    backgroundColor: 'blue', // Blue color for download button
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
    backgroundColor: 'black', // Gray color for back button
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    fontFamily: 'Poppins',
    color:'black'
  },
  inputLabel: {
    fontFamily: 'Poppins',
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontFamily: 'Poppins',
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 40,
    marginBottom: 30,
  },
});
