import "./App.css"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useState } from "react";
import axios from 'axios';
import SearchableDropdown from "./DropDown";
import { languages as options } from "./data";

const App = () => {
  const [selectedValue, setSelectedValue] = useState("English");
  const handleDropdownChange = (value) => {
    setSelectedValue(value);
  };
  const [translatedText, setTranslatedText] = useState('');
  const startListening = () => SpeechRecognition.startListening({ continuous: true });
  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  const handleTranslate = async () => {
    try {
      const getIdByName = (name) => {
        const language = options.find(lang => lang.name === name);
        return language ? language.id : null;
      };
      const to = getIdByName(selectedValue)
      const response = await axios.post('http://localhost:8000/translate', { text: transcript, to: to });
      console.log('Translation response:', response.data);
      setTranslatedText(response.data.trans);
    } catch (error) {
      console.error('Error translating text:', error);
    }
  };

  return (
    <>
      <div className="container">
        <h2>Language Translation Web Application</h2>
        <br />
        <p>This application leverages a translation library to convert text between languages, featuring a user-friendly interface for seamless interaction</p>
        <SearchableDropdown
          options={options}
          label="name"
          id="dropdown"
          selectedVal={selectedValue}
          handleChange={handleDropdownChange}
        />
        <div className="main-content-wrapper">
          <div className="main-content">
            {transcript || "Start Talking"}
          </div>
          <div className="main-content">
            {translatedText || "Translated text will appear here"}
          </div>
        </div>

        <div className="btn-style">
          <button onClick={startListening}>Start Listening</button>
          <button onClick={SpeechRecognition.stopListening}>Stop Listening</button>
          <button onClick={handleTranslate}>Translate</button>
        </div>
      </div>
    </>
  );
};

export default App;