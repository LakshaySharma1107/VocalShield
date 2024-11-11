import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import RNFS from 'react-native-fs';
import { getFilename, getFilePath, getFileUrluploaded, setFileAudioUID, getFileAudioUID } from './filepath';
import Mic from './mic.png';

const getFileUri = async (uri) => {
  try {
    const filePath = `${RNFS.DocumentDirectoryPath}/audio_${getFileAudioUID()}.wav`;
    await RNFS.copyFile(uri, filePath);
    return 'file://' + filePath;
  } catch (error) {
    console.error("Error converting URI:", error);
    return null;
  }
};

export default function ProcessPage() {
  const [audioFile, setAudioFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedAudio, setProcessedAudio] = useState(null);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null); // State for selected model
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFile = async () => {
      const uri = await getFileUri(getFileUrluploaded());
      if (uri) {
        setAudioFile({ uri, name: `audio_${getFileAudioUID()}.wav` });
      }
    };
    fetchFile();
  }, []);

  const processAudioFile = async () => {
    if (!audioFile) {
      Alert.alert('No file selected', 'Please select an audio file to process.');
      return;
    }

    if (!selectedModel) {
      Alert.alert('No model selected', 'Please choose a model to process the audio.');
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('audio', {
      uri: audioFile.uri,
      type: 'audio/wav',
      name: audioFile.name,
    });
    formData.append('model', selectedModel); // Add the selected model to the form data

    try {
      const response = await axios.post('http://192.168.0.109:5000/process-audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.processed_audio) {
        setProcessedAudio(response.data.processed_audio);
        setIsProcessing(false);
        setError(null);
      } else {
        setIsProcessing(false);
        setError('Processing failed. No processed audio returned.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsProcessing(false);
      setError('Failed to upload the audio file. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.imgcontainer}>
        <Image source={Mic} style={styles.image} />
        <Text style={styles.titleText}>
          {isProcessing ? 'Processing Your Audio' : 'Processing Completed'}
        </Text>

        <Text style={styles.fileInfoText}>
          {audioFile ? `File: ${audioFile.name}` : 'No file selected'}
        </Text>

        <View style={styles.modelButtonsContainer}>
          {/* Model selection buttons */}
          <TouchableOpacity
            style={[styles.modelButton, selectedModel === 'Audio Model' && styles.selectedModel]}
            onPress={() => setSelectedModel('Audio Model')}
          >
            <Text style={styles.buttonText}>Audio Model</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modelButton, selectedModel === 'Text Model' && styles.selectedModel]}
            onPress={() => setSelectedModel('Text Model')}
          >
            <Text style={styles.buttonText}>Text Model</Text>
          </TouchableOpacity>
        </View>

        {/* Process file button */}
        <TouchableOpacity
          style={[styles.button1, isProcessing && styles.processingButton]}
          onPress={processAudioFile}
          disabled={isProcessing}
        >
          <Text style={styles.buttonText}>
            {isProcessing ? 'Processing...' : 'Process Audio'}
          </Text>
        </TouchableOpacity>

        {error && <Text style={styles.errorText}>{error}</Text>}

        {processedAudio && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('AnalysisPage', { processedAudio });
            }}
          >
            <Text style={styles.buttonText}>View Processed Audio</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  imgcontainer: {
    marginTop: 30,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleText: {
    fontFamily: 'Poppins',
    fontSize: 24,
    color: '#333',
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fileInfoText: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  modelButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#cccccc',
    marginHorizontal: 10,
  },
  selectedModel: {
    backgroundColor: 'blue',
  },
  button1: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginTop: 20,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 260,
    height: 50,
  },
  processingButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Poppins',
    color: '#ffffff',
    textAlign: 'center',
  },
  image: {
    height: 150,
    width: 150,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});
