// components/AudioRecorder.jsx
import React, { useState } from 'react';
import axios from 'axios';

const AudioRecorder = ({ addNote }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
      const blob = new Blob([e.data], { type: 'audio/wav' });
      setAudioBlob(blob);
      addNote(blob); // Pass the recorded blob to parent component
    };
    recorder.start();
    setIsRecording(true);
    setMediaRecorder(recorder);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
  };

  const sendToBackend = async () => {
    if (audioBlob) {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');

      try {
        const response = await axios.post('http://localhost:3000/transcribe', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Transcription:', response.data.transcription);
      } catch (error) {
        console.error('Error sending audio to backend:', error);
      }
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-xl mb-4">Record a Note</h2>
      {isRecording ? (
        <button
          onClick={() => {
            stopRecording();
            sendToBackend(); // Send the recorded audio to the backend when recording stops
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Stop Recording
        </button>
      ) : (
        <button onClick={startRecording} className="bg-green-500 text-white px-4 py-2 rounded">
          Start Recording
        </button>
      )}
    </div>
  );
};

export default AudioRecorder;
