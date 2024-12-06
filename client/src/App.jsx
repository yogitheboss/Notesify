// App.jsx
import React, { useState } from "react";
import AudioRecorder from "./components/AudioRecorder";
import NoteList from "./components/NoteList";
import Sidebar from "./components/Sidebar";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [tab, setTab] = useState("create");
  const addNote = (audioBlob) => {
    setNotes([...notes, audioBlob]);
  };

  const removeNote = (indexToRemove) => {
    const updatedNotes = notes.filter((_, index) => index !== indexToRemove);
    setNotes(updatedNotes);
  };

  return (
    <div className="container mx-auto h-screen p-4 -700 flex ">
      <Sidebar tab={tab} setTab={setTab} />
      <div className="w-full p-4">
        <h1 className="text-2xl font-bold mb-4">
          AI powered Lecture Note taker
        </h1>
        <AudioRecorder addNote={addNote} />
        <NoteList notes={notes} removeNote={removeNote} />
      </div>
    </div>
  );
};

export default App;
