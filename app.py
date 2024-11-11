from flask import Flask, request, jsonify, send_file, abort
from flask_cors import CORS
from pydub import AudioSegment
import numpy as np
import librosa
from tensorflow.keras.models import load_model
from tensorflow.keras.optimizers import Adam
import os
import time
import shutil

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests for React Native

# Load your pre-trained model
model = load_model('My_Best_Model.h5')
model.compile(optimizer=Adam(), loss='categorical_crossentropy', metrics=['accuracy'])

# Define the segment duration (500 milliseconds)
segment_duration = 500


# Function to extract features from audio segments
def extract_features_from_segment(segment):
    try:
        samples = np.array(segment.get_array_of_samples()).astype(np.float32)
        mfccs = librosa.feature.mfcc(y=samples, sr=segment.frame_rate, n_mfcc=15)
        mfccs = np.mean(mfccs.T, axis=0)
        return mfccs
    except Exception as e:
        print(f"Error processing segment: {e}")
        return None

# Function to process the audio file and mute bad words
def process_audio(audio):
    global audio_file_name
    try:
        bad_word_indices = []  # Store indices of bad word segments
        segments = []  # To store MFCC features for each segment

        # Split the audio into segments and process each segment
        for i in range(0, len(audio), segment_duration):
            segment = audio[i:i + segment_duration]
            mfccs = extract_features_from_segment(segment)
            if mfccs is not None:
                segments.append(mfccs)

        # Prepare the input for the model
        X_test = np.array(segments)

        if len(X_test) > 0:
            # Get predictions from the model
            predictions = model.predict(X_test)
            
            # Check for bad word predictions (Assuming 1 means bad word)
            for i, pred in enumerate(predictions):
                if np.argmax(pred) == 1:  # Assuming bad word is labeled as 1
                    start_time = i * segment_duration
                    end_time = start_time + segment_duration
                    bad_word_indices.append((start_time, end_time))

            # Mute the bad words in the audio
            for start, end in bad_word_indices:
                audio = audio[:start] + AudioSegment.silent(duration=end - start) + audio[end:]

            # Save the processed (muted) audio to a file
            processed_audio_path = f'static/muted_audio_{audio_file_name}'
            audio.export(processed_audio_path, format="wav")
            return processed_audio_path
        else:
            print("No valid segments to predict.")
            return None
    except Exception as e:
        print(f"Error processing audio file: {e}")
        return None

#Function to apply text model
def process_audio_text(audio):
    global audio_file_name
    try:
        bad_word_indices = []  # Store indices of bad word segments
        segments = []  # To store MFCC features for each segment

        # Split the audio into segments and process each segment
        for i in range(0, len(audio), segment_duration):
            segment = audio[i:i + segment_duration]
            mfccs = extract_features_from_segment(segment)
            if mfccs is not None:
                segments.append(mfccs)

        # Prepare the input for the model
        X_test = np.array(segments)

        if len(X_test) > 0:
            # Get predictions from the model
            predictions = model.predict(X_test)
            
            # Check for bad word predictions (Assuming 1 means bad word)
            for i, pred in enumerate(predictions):
                if np.argmax(pred) == 1:  # Assuming bad word is labeled as 1
                    start_time = i * segment_duration
                    end_time = start_time + segment_duration
                    bad_word_indices.append((start_time, end_time))

            # Mute the bad words in the audio
            for start, end in bad_word_indices:
                audio = audio[:start] + AudioSegment.silent(duration=end - start) + audio[end:]

            # Save the processed (muted) audio to a file
            processed_audio_path = f'static/muted_audio_{audio_file_name}'
            audio.export(processed_audio_path, format="wav")
            return processed_audio_path
        else:
            print("No valid segments to predict.")
            return None
    except Exception as e:
        print(f"Error processing audio file: {e}")
        return None


audio_file_name = "" ########-----------
file_path_glob = ""
# API route to process the audio
@app.route('/process-audio', methods=['POST'])
def process_audio_route():
    global file_path_glob, audio_file_name
    try:
        # print(audio_file)
        # Receive the audio file from the request
        audio_file = request.files.get('audio')
        model_type = request.form.get('model') #gets which model is picked


        print(audio_file)    
        print(audio_file.filename)
        audio_file_name  = audio_file.filename

        if not audio_file:
            return jsonify({'status': 'error', 'message': 'No audio file received'}), 400

        # Determine the file extension and load it
        file_extension = audio_file.filename.split('.')[-1].lower()
        if file_extension not in ['wav', 'mp3']:
            return jsonify({'status': 'error', 'message': 'Invalid file format. Only WAV and MP3 are supported.'}), 400

        # Save the uploaded file temporarily
        temp_file_path = os.path.join('static', audio_file.filename)
        print(temp_file_path)
        audio_file.save(temp_file_path)

        # Load the audio file with pydub
        if file_extension == 'wav':
            audio = AudioSegment.from_wav(temp_file_path)
        else:
            audio = AudioSegment.from_mp3(temp_file_path)

        # Process the audio file
        if model_type == 'Audio Model':
            processed_audio_path = process_audio(audio)
        
        else:
            processed_audio_path = process_audio_text(audio)
            
        file_path_glob = processed_audio_path
        print("Global File Path === ",file_path_glob)
        
        if processed_audio_path:
            return jsonify({'processed_audio': f'/{processed_audio_path}'}), 200
        else:
            return jsonify({'status': 'error', 'message': 'Processing failed'}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Serve processed audio files and delete them after serving
@app.route('/static/<filename>')
def serve_and_delete_file(filename):
    global file_path_glob
    # file_path = os.path.join('static', filename)
    # file_path = f"static/muted_{audio_file_name}"
    file_path = file_path_glob
    print(file_path)
    try:
        # Send the file
        response = send_file(file_path)
        print(response)
        return response
    # except FileNotFoundError:
    #     abort(404, description="File not found")
    # except Exception as e:
    except:
        pass
    #     abort(500, description=str(e))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)