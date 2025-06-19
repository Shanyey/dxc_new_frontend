import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import TopBar from "../../components/TopBar/TopBar";

import "./TranslationPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
//import Loader from "../components/Loader";

import CopyIcon from "../../assets/icons/content-copy-icon.png";
import SingleArrow from "../../assets/icons/single-arrow-icon.png";
import TranslationArrow from "../../assets/icons/translation-arrow-icon.png";
import TrashIcon from "../../assets/icons/trash-icon.png";

import { NavLink, useNavigate } from "react-router-dom";
//import addQuery from "../services/dbServices";

import languages from "./Languages";

function TranslationPage() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState();

  // GPT models
  const models = [
    { value: "gpt-4o-mini", label: "GPT-4o-mini" },
    { value: "gpt-4o", label: "GPT-4o" },
  ];

  // Default model is GPT 4o mini
  const [selectedModel, setSelectedModel] = useState(models[0]);

  // Default mode is verbatim
  const [selectedTranslationType, setSelectedTranslationType] = useState({
    value: "verbatim",
    label: "Verbatim Translation",
  });

  // Modes
  const translationTypes = [
    { value: "verbatim", label: "Verbatim Translation" },
    { value: "summarization", label: "Summarization" },
  ];

  // Text translation
  const [langFrom, setLangFrom] = useState("Detect language"); // variable that is sent to backend: from language
  const [langTo, setLangTo] = useState("English"); // variable that is sent to backend: to language
  const [inputText, setInputText] = useState(""); // variable that is sent to backend: input
  const [translatedText, setTranslatedText] = useState("");
  const [customLanguage, setCustomLanguage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [user, setUser] = useState(
    window.location.pathname.split("/").pop() === "9" ? "9" : "default"
  );

  const [debouncedValue, setDebouncedValue] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(true);

  const copyFunction = () => {
    var copyText = document.getElementById("output-textarea");
    console.log(copyText.value);
    // copyText.select();
    // copyText.setSelectionRange(0,99999);

    navigator.clipboard.writeText(copyText.value);

    alert("Copied the text: " + copyText.value);
  };

  const handleSetLangToEnglish = () => {
    if (customLanguage) {
      setLangTo(customLanguage);
    } else {
      setLangTo("English");
    }
    // Update the button value
    const button = document.getElementById("english-button");
    if (button) {
      button.textContent = customLanguage;
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text); // Update input text state with the value from the input textarea
    if (text.trim() === "") {
      setTranslatedText("");
    }
  };

  const clearInputArea = () => {
    // Update the button value
    const inputarea = document.getElementById("input-textarea");
    if (inputarea) {
      inputarea.textContent = "";
      setInputText("");
    }
  };

  const handleSwapToAndFrom = () => {
    setLangFrom((prevLangFrom) => {
      if (prevLangFrom === "Detect language") {
        const tempLangTo = langTo;
        setLangTo("Chinese");
        return tempLangTo;
      }
      const tempLang = langTo;
      setLangTo(prevLangFrom);
      return tempLang;
    });
    const current_input = inputText;
    const current_translated = translatedText;
    setInputText(current_translated);
    setTranslatedText(current_input);
  };

  useEffect(() => {
    const fromButton = document.getElementById("detect-language");
    if (fromButton) {
      fromButton.textContent = langFrom;
    }
    const toButton = document.getElementById("english-button");
    if (toButton) {
      toButton.textContent = langTo;
    }
  }, [langFrom, langTo]);

  async function sendDataToBackend() {
    try {
      // Send the input text to detect the language directly with fetch
      const response = await fetch(
        "http://127.0.0.1:5000/translation/detectLanguage",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: inputText,
            user: user,
            model: selectedModel.value,
          }),
        }
      );

      // Check if the response status is OK
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Assuming the response data is JSON
      const data = await response.json();

      // Assuming you're accessing the first item in the returned array
      const detectedLanguage = data[0];
      console.log(detectedLanguage);

      setLangFrom(detectedLanguage);
    } catch (error) {
      console.error("Language detection failed:", error);
      throw error;
    }
  }

  // Update debounced value after delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputText);
    }, 1000); // Adjust the delay as needed (e.g., 1000ms = 1 second)

    // Cleanup function to clear the timeout inputText changes before the delay
    return () => {
      clearTimeout(handler);
    };
  }, [inputText]);

  // Send data to backend when debouncedValue updates and button is clicked
  useEffect(() => {
    if (debouncedValue && isButtonClicked) {
      sendDataToBackend(debouncedValue);
    }
  }, [debouncedValue, isButtonClicked]);

  const handleButtonClick = () => {
    setIsButtonClicked(true);
  };

  const handleTranslate = async () => {
    if (
      inputText.trim() === "" ||
      langFrom === "Undefined" ||
      langFrom === langTo
    ) {
      let message = "";
      if (inputText.trim() === "") {
        message = "Input text is empty!";
      } else if (langFrom === "Undefined") {
        message = "Please select a language from the dropdown box!";
      } else if (langFrom === langTo) {
        message = "Both languages are the same.";
      }
      window.confirm(message);
      return;
    }

    try {
      setIsLoading(true);
      const endpoint =
        selectedTranslationType.value === "verbatim"
          ? "http://127.0.0.1:5000/translation/translatetext_verbatim"
          : "http://127.0.0.1:5000/translation/translatetext";

      // Direct fetch call to the endpoint
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          user: user,
          model: selectedModel.value,
          languageFrom: langFrom,
          languageTo: langTo,
        }),
      });

      // Check if the response status is OK
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Parse the response data
      const data = await response.json();
      const translationResult = data[0]; // Assuming first element in the array is the translation result

      // Set the translated text
      setTranslatedText(translationResult);

      setIsLoading(false);
    } catch (error) {
      console.error("Translation failed:", error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div className="page">
      <TopBar />
      <div className="translationpage-content">
        <div className="translationpage-top-bar">
          <div className="select-btn">
            <span className="select-text2"> Select translation type: </span>
            <Select
              id="select-translation-type"
              defaultValue={selectedTranslationType}
              onChange={setSelectedTranslationType}
              options={translationTypes}
              placeholder="Select Translation Type"
            />
          </div>
          <div className="select-btn">
            <span className="select-text"> Select model: </span>
            <Select
              id="select-model"
              defaultValue={selectedModel}
              onChange={setSelectedModel}
              options={models}
              placeholder="Select Model"
            />
          </div>
        </div>
        <div>
          <div className="translation-textarea">
              <div id="left-side">
                <div className="detect-language-btns">
                  <select
                    id="from-language-dropdown"
                    value={langFrom}
                    onChange={(e) => setLangFrom(e.target.value)}
                    className="detect-language"
                  >
                    <option value="Detect language">Detect language</option>
                    {languages.map((lang, idx) => (
                      <option key={idx} value={lang.value}>
                        {lang.value}
                      </option>
                    ))}
                  </select>
                  <button onClick={clearInputArea} className="clear-button">
                    <img src={TrashIcon} alt="Clear" />
                  </button>
                </div>
                <textarea
                  id="input-textarea"
                  value={inputText}
                  onChange={handleInputChange}
                  tabIndex="0"
                  placeholder="Input text to translate"
                  className="textArea"
                />
              </div>
              
              <button className="arrows">
                <img
                  src={
                    langFrom === "Detect language"
                      ? SingleArrow
                      : TranslationArrow
                  }
                  alt="Arrow"
                />
              </button>
              
                <div id="right-side">
                  <div className="translated-language">
                    {/* Dropdown for language selection */}
                    <select
                      id="to-language-dropdown"
                      value={langTo}
                      onChange={(e) => setLangTo(e.target.value)}
                      className="select-language"
                    >
                      <option value="English">English</option>
                      {languages
                        .filter((lang) => lang.value !== "English")
                        .map((lang, idx) => (
                          <option key={idx} value={lang.value}>
                            {lang.value}
                          </option>
                        ))}
                    </select>
                    {/* Input for custom language */}
                    <input
                      type="text"
                      placeholder="Custom language"
                      value={customLanguage}
                      onChange={(e) => setCustomLanguage(e.target.value)}
                      onBlur={() => {
                        if (customLanguage.trim())
                          setLangTo(customLanguage.trim());
                      }}
                      className="custom-language"
                      style={{ minWidth: 120 }}
                    />
                    <button
                      className="copy-button"
                      onClick={copyFunction}
                      id="copy-button"
                    >
                      <img src={CopyIcon} alt="Copy" />
                    </button>
                  </div>
                    <textarea
                      id="output-textarea"
                      value={translatedText}
                      tabIndex="0"
                      placeholder="Translation"
                      className="textArea"
                      readOnly
                    />
                </div>
          </div>
        </div>
        <button
          id="translate-button"
          className="btn btn-success translate"
          onClick={handleTranslate}
        >
          Translate
        </button>
      </div>
    </div>
  );
}

export default TranslationPage;
