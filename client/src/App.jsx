// App.jsx
import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import NoteList from './components/NoteList';

const App = () => {
  const [notes, setNotes] = useState([]);

  const addNote = (audioBlob) => {
    setNotes([...notes, audioBlob]);
  };

  const removeNote = (indexToRemove) => {
    const updatedNotes = notes.filter((_, index) => index !== indexToRemove);
    setNotes(updatedNotes);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Audio Note Taker</h1>
      <AudioRecorder addNote={addNote} />
      <NoteList notes={notes} removeNote={removeNote} />
    </div>
  );
};

export default App;
