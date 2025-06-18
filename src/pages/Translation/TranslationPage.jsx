import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import TopBar from "../../components/TopBar/TopBar";


import "./TranslationPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
//import Loader from "../components/Loader";

import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SingleArrow from "../../assets/icons/single-arrow-icon.png";
import TranslationArrow from "../../assets/icons/translation-arrow-icon.png";

//temporarily disabled
//import { auth } from "../Firebase";
import { NavLink, useNavigate } from "react-router-dom";
//import addQuery from "../services/dbServices";

import languages from './Languages';

function TranslationPage() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState();

  // Temporarily disabled
  // useEffect(() => {
  //   auth.onAuthStateChanged((user) => {
  //     console.log(user);
  //     if (user) {
  //       setUserInfo({
  //         userDetails: user.displayName,
  //         userImage: user.photoURL,
  //         userMail: user.email,
  //       });
  //     } else {
  //       navigate("/");
  //     }
  //   });
  // }, []);


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
    { value: "summarization", label: "Summarization" }
  ];

  // Text translation
  const [langFrom, setLangFrom] = useState("Detect language"); // variable that is sent to backend: from language
  const [langTo, setLangTo] = useState("English"); // variable that is sent to backend: to language
  const [inputText, setInputText] = useState(""); // variable that is sent to backend: input
  const [translatedText, setTranslatedText] = useState("");
  const [customLanguage, setCustomLanguage] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [user, setUser] = useState(
    window.location.pathname.split("/").pop() === "9" ? "9" : "default"
  );

  // Arrange languages in a 5x3 grid (columns fill top-down)
  const columns = 3;
  const rows = 5;
  const gridLanguages = Array.from({ length: rows }, (_, rowIndex) => 
    languages.filter((_, index) => index % rows === rowIndex)
  ).flat();

  const [isDropdownFromOpen, setIsDropdownFromOpen] = useState(false);
  const [isDropdownToOpen, setIsDropdownToOpen] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState('');
  const [isButtonClicked, setIsButtonClicked] = useState(true);

  const copyFunction = () => {
    var copyText = document.getElementById("output-textarea");
    console.log(copyText.value)
    // copyText.select();
    // copyText.setSelectionRange(0,99999);

    navigator.clipboard.writeText(copyText.value);

    alert("Copied the text: " + copyText.value);
  }
 
  const handleSetLangToEnglish = () => {
    if (customLanguage) {
      setLangTo(customLanguage);
    } else {
      setLangTo('English');
    }
    // Update the button value
    const button = document.getElementById("english-button");
    if (button) {
      button.textContent = customLanguage;
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value
    setInputText(text); // Update input text state with the value from the input textarea
    if (text.trim() === ''){
      setTranslatedText('');
    }
  };

  const clearInputArea = () => {
      // Update the button value
    const inputarea = document.getElementById("input-textarea");
    if (inputarea) {
      inputarea.textContent = '';
      setInputText('');
    }
    
  }

  const handleCustomLangaugeFromChange = (e) => {
    setLangFrom(e.target.value); // Update input text state with the value from the input textarea
    // setIsDropdownFromOpen(false);
  };
  const handleCustomLangaugeToChange = (e) => {
    setCustomLanguage(e.target.value); // Update input text state with the value from the input textarea
  };

  const handleCustomToLanguageKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default action to avoid adding a newline
      console.log(langFrom); 
      console.log(langTo); // Print the value of langTo to the console
      handleSetLangToEnglish();
      setIsDropdownToOpen(false); // Close dropdown
    }
  };

  const handleCustomFromLanguageKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default action to avoid adding a newline
      console.log(langFrom); 
      console.log(langTo); // Print the value of langTo to the console
      setIsDropdownFromOpen(false); // Close dropdown
    }
  };

  const handleDropDownFromButtonClick = () => {
    setIsDropdownFromOpen(!isDropdownFromOpen);
    setIsDropdownToOpen(false);
  };

  const handleLanguageFromClick = (language) => {
    const selectedLanguageValue = language.value;
    setLangFrom(selectedLanguageValue );
    setCustomLanguage(selectedLanguageValue);
    setIsDropdownFromOpen(false);
    setIsChineseButtonClicked(false);
    setIsMalayButtonClicked(false);
    setIsTamilButtonClicked(false);
    setIsButtonClicked(true)
  };

  const handleDropDownToButtonClick = () => {
    setIsDropdownToOpen(!isDropdownToOpen);
    setIsDropdownFromOpen(false);
  };

  const handleLanguageToClick = (language) => {
    const selectedLanguageValue = language.value;
    setLangTo(selectedLanguageValue);
    setCustomLanguage(selectedLanguageValue);
    setIsDropdownToOpen(false);

  };

  const handleSwapToAndFrom = () => {
    setLangFrom((prevLangFrom) => {
      if (prevLangFrom === 'Detect language') {
        const tempLangTo = langTo;
        setLangTo('Chinese');
        return tempLangTo;
      }
      const tempLang = langTo;
      setLangTo(prevLangFrom);
      return tempLang;
    });
    const current_input = inputText
    const current_translated = translatedText
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
      const response = await fetch(`${baseUrl}/detectLanguage`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          user: user,
          model: selectedModel.value,
        }),
      });

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
    if (inputText.trim() === '' || langFrom === 'Undefined' || langFrom === langTo) {
      let message = '';
      if (inputText.trim() === '') {
        message = "Input text is empty!";
      } else if (langFrom === 'Undefined') {
        message = "Please select a language from the dropdown box!";
      } else if (langFrom === langTo) {
        message = "Both languages are the same.";
      }
      if (!window.confirm(message)) {
        return; // Exit the function if user clicks "Cancel"
      }
    } else {
      try {
        setIsLoading(true);
        const endpoint = selectedTranslationType.value === "verbatim" 
        ? `${baseUrl}/translatetext`
        : `${baseUrl}/translatetext`;

        // Direct fetch call to the endpoint
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: inputText,
            user: user,
            model: selectedModel.value,
            languageFrom: langFrom,
            languageTo: langTo
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

        // Optional: Add the query details to your log or UI
        addQuery(inputText, translationResult, userInfo, selectedModel.value, null);
        setIsLoading(false);
      } catch (error) {
        console.error("Translation failed:", error);
        // Handle error (e.g., show error message)
      }
  }
  }


  return (
    <div className="page">
      <TopBar />
      <div className="translationpage-header">
        Translation
      </div>
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
        <div className="translation-main-content">
          <div>
            <div>
              <div id="left-side">
                <div>
                  <select
                  id="from-language-dropdown"
                  value={langFrom}
                  onChange={e => setLangFrom(e.target.value)}
                  className="text-black px-2 py-2 mb-0 border rounded bg-inherit hover:bg-gray-100"
                >
                  <option value="Detect language">Detect language</option>
                  {languages.map((lang, idx) => (
                    <option key={idx} value={lang.value}>{lang.value}</option>
                  ))}
                </select>
                  {/* <button id="dropdownbutton1" onClick={handleDropDownFromButtonClick} className="bg-inherit hover:bg-gray-100 hover:border-transparent">
                    {isDropdownFromOpen ? <ExpandLessIcon className="h-6 w-6 text-gray-400" /> : <ExpandMoreIcon className="h-6 w-6 text-gray-400" />}
                  </button>
                  {isDropdownFromOpen && (
                    <div className="absolute mt-10 w-full bg-white border border-gray-300 rounded shadow-lg max-h-80">
                      <textarea 
                        className="textArea w-full text-sm"
                        placeholder="Input custom language"
                        onChange={handleCustomLangaugeFromChange}
                        onKeyDown={handleCustomFromLanguageKeyPress} // Handle Enter key press
                      >
                      </textarea>
                      <div className="grid grid-cols-3 gap-2 p-2">
                        {gridLanguages.map((language, index) => (
                          <button
                            key={index}
                            onClick={() => handleLanguageFromClick(language)}
                            className="bg-slate-50 w-full text-left p-2 hover:bg-slate-200"
                          >
                            {language && language.value}
                          </button>
                          ))}
                      </div>
                    </div> */}
                  <button onClick={clearInputArea} className="clear-button">
                  Clear
                </button>
                </div>
                <textarea
                  id="input-textarea"
                  value={inputText}
                  onChange={handleInputChange}
                  tabIndex="0"
                  placeholder="Input text to translate"
                  className="textArea w-full overflow-y-hidden h-lvh "
                />
                
              </div>
              <div id="right-side" className="flex flex-col w-1/2 relative pr-10">
                <div className="flex relative">
                  <button className="arrows">
                    <img
                    src={langFrom === "Detect language" ? SingleArrow : TranslationArrow}
                    alt="Arrow"
                  />
                  </button>
                  {/* <button
                  id = "english-button"
                  onClick={handleSetLangToEnglish}
                  className={`text-black px-2 bg-inherit py-2 mb-0 hover:bg-gray-100 hover:border-transparent ${isButtonClicked ? 'border-b-4 border-indigo-500' : 'bg-inherit'}`}
                  >
                    English
                  </button>
                  <button id="dropdownbutton2" onClick={handleDropDownToButtonClick} className="bg-inherit hover:bg-gray-100 hover:border-transparent">
                    {isDropdownToOpen ? <ExpandLessIcon className="h-6 w-6 text-gray-400" /> : <ExpandMoreIcon className="h-6 w-6 text-gray-400" />}
                  </button>
                  {isDropdownToOpen && (
                    <div className="absolute mt-10 w-full bg-white border border-gray-300 rounded shadow-lg max-h-80">
                      <textarea 
                        className="textArea w-full text-sm"
                        placeholder="Input custom language"
                        value={customLanguage}
                        onChange={handleCustomLangaugeToChange}
                        onKeyDown={handleCustomToLanguageKeyPress} // Handle Enter key press
                      >
                      </textarea>
                      <div className="grid grid-cols-3 gap-2 p-2">
                        {gridLanguages.map((language, index) => (
                          <button
                            key={index}
                            onClick={() => handleLanguageToClick(language)}
                            className="bg-slate-50 w-full text-left p-2 hover:border-transparent hover:bg-slate-200"
                          >
                            {language.value}
                          </button>
                        ))}
                      </div>
                    </div> */}
                  <div className="flex items-center gap-2">
                  {/* Dropdown for language selection */}
                  <select
                    id="to-language-dropdown"
                    value={langTo}
                    onChange={e => setLangTo(e.target.value)}
                    className="text-black px-2 py-2 mb-0 border rounded bg-inherit hover:bg-gray-100"
                  >
                    <option value="English">English</option>
                    {languages
                      .filter(lang => lang.value !== "English")
                      .map((lang, idx) => (
                        <option key={idx} value={lang.value}>{lang.value}</option>
                      ))}
                  </select>
                  {/* Input for custom language */}
                  <input
                    type="text"
                    placeholder="Custom language"
                    value={customLanguage}
                    onChange={e => setCustomLanguage(e.target.value)}
                    onBlur={() => {
                      if (customLanguage.trim()) setLangTo(customLanguage.trim());
                    }}
                    className="text-black px-2 py-2 mb-0 border rounded bg-inherit hover:bg-gray-100"
                    style={{ minWidth: 120 }}
                  />
                  <button className="copy-button" onClick={copyFunction} id="copy-button">
                    <ContentCopyIcon className="content-copy" />
                  </button>
                </div>
                  
                </div>
                <textarea
                  id="output-textarea"
                  value={translatedText}
                  tabIndex="0"
                  placeholder="Translation"
                  className="textArea w-full overflow-y-hidden h-lvh"
                  readOnly
                />
              </div>
            </div>
            {/* {isLoading ? <Loader>Translating text, please wait...</Loader> : null} */}
            <button
              id = "translate-button"
              className="btn btn-success translate"
              onClick={handleTranslate}
            >
              Translate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TranslationPage;






