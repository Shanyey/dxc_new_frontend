import "./BFQPage.css";
import TopBar from "../../components/TopBar/TopBar";
import React, { useState, useEffect, useRef } from "react";
//to be reinstalled when ready to use BatchProcessing file
//import MyDropzone from "../components/BatchProcessing";
import Select from "react-select";

//to be reinstalled when firebase is properly set up
//import { auth } from "../Firebase";
import { NavLink, useNavigate } from "react-router-dom";

//For temporary react-dropzone
import {useCallback} from 'react'
import Dropzone from 'react-dropzone'

function BatchFileQueryPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState();


  //To be reinstalled when firebase is properly set up
  /*useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        setUserInfo({
          userDetails: user.displayName,
          userImage: user.photoURL,
          userMail: user.email,
        });
      } else {
        navigate("/");
      }
    });
  }, []);*/

  const [tooltipEnabled, setTooltipEnabled] = useState(false);

  // For users to select the 3 different GPT models: String to identify the model, label: String for Select Dropdown option at the top, deploymentName: to initialise the correct deployment in Azure
  const models = [
    { value: "gpt-4o-mini", label: "GPT-4o-mini", deploymentName: "gpt4-o-mini" },
    { value: "gpt-4o", label: "GPT-4o", deploymentName: "gpt4o" },
  ];

  // Default model selected is GPT4o mini
  const [selectedOption, setSelectedOption] = useState(models[0]);

  const [inputLanguage, setInputLanguage] = useState("English");
  const [updatedLanguage, setUpdatedLanguage] = useState(inputLanguage);

  // to handle personalised prompts
  // default prompt before the user input his own prompt
  const [personalisedPrompt, setPersonalisedPrompt] = useState(
    "(Currently Empty, please input prompt above)"
  );
  // updated prompt to be set once the user keys in his prompt
  const [updatedPrompt, setUpdatedPrompt] = useState(personalisedPrompt);

  // 4 functions.  value: To be passed into BatchProcessing.jsx component as the prompt. label: String for Select Dropdown option for user to choose function. naming: String to be passed into BatchProcessing.jsx component as props for naming of download file
  const functions = [
    {
      value: "Summarize: ",
      label: "Summarization",
      naming: "sum",
    },
    {
      value: "Extract the keywords from: ",
      label: "Keyword Extraction",
      naming: "key",
    },
    {
      value: "Translate to " + updatedLanguage + ":",
      label: "Translation (Summary)",
      naming: "tra",
    },
    {
      value: "Peform a verbatim translation to" + updatedLanguage + ":",
      label: "Translation (Verbatim)",
      naming: "verbatim_tra"
    },
    {
      value: updatedPrompt + ":",
      label: "Personalise Prompt",
      naming: "prompt",
    },
  ];

  // default function is Summarization
  const [func, setFunc] = useState({
    value: "Summarize: ",
    naming: "sum",
    label: "Summarization",
  });

  // set input language upon user input
  function handleLangChange(e) {
    setInputLanguage(e.target.value);
  }

  // set updated language when user clicks Change button
  function handleLangClick() {
    setUpdatedLanguage(inputLanguage);
    setFunc({ ...func, value: "Translate to " + updatedLanguage + ":" });
  }

  // upon personalised prompt keyed in and clicked on button
  function handlePersonalisedPromptClick() {
    setUpdatedPrompt(personalisedPrompt);
  }

  // upon user key in prompt text box
  function handlePersonalisedPromptChange(e) {
    setPersonalisedPrompt(e.target.value);
  }

  // --------------------------- UseEffect ---------------------------
  const isMounted = useRef(false);

  // useEffect to trigger change of language only upon user input and not during initial render
  useEffect(() => {
    if (isMounted.current) {
      setFunc({ ...func, value: "Translate to " + updatedLanguage + ":" });
    } else {
      isMounted.current = false;
    }
  }, [updatedLanguage]);

  // useEffect to trigger change of personalised prompt only upon user input and not during initial render
  useEffect(() => {
    if (isMounted.current) {
      setFunc({
        ...func,
        value:
          updatedPrompt +
          ". Please do not give any information relating to html tags." +
          ":",
      });
    } else {
      isMounted.current = true;
    }
  }, [updatedPrompt]);

  return (
    <>
      <div className="page">
        <TopBar />
        <div className="batchfilequery-main-content">
            <div className="BFQIntro">
                <h2>
                    Batch File Query can handle
                </h2>
                <ul>
                    <li>Summary of Batch Files</li>
                    <li>Extract Keywords</li>
                    <li>Translate</li>
                    <li>Personalise Prompt</li>
                </ul>
            </div>

          <div className="select-container">
            <div className="select-btn">
              <span className="select-text">Select function: </span>
              <Select
                id="select-func"
                defaultValue={func}
                onChange={(e) => {
                  setFunc(e);
                }}
                options={functions}
                placeholder="Select Function"
                className="text-sm"
              />
            </div>

            <div className="select-btn">
              <span className="select-text">Select model: </span>
              <Select
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={models}
                id="select-model"
                placeholder="Select Model"
              />
            </div>
          </div>

          
          {/* only renders if user chooses translation */}
          {(func.label == "Translation (Summary)" || func.label == "Translation (Verbatim)") && (
            <div className="translation-container">
              <label>
                Translate to {updatedLanguage} or translate to another language:
              </label>
              <input
                type="text"
                placeholder="Input a language"
                id="input-lang"
                onChange={handleLangChange}
                className="translation-input"
              />
              <button
                className="translation-button"
                onClick={handleLangClick}
                id="input-lang-button"
              >
                Change
              </button>
            </div>
          )}

          {/* only renders if user chooses personalise prompt */}
          {func.label == "Personalise Prompt" && (
            <div>
              <div className="translation-container">
                <label>Input your own prompt:</label>
                <input
                  type="text"
                  placeholder="For eg, 'Extract the personnel names mentioned'"
                  onChange={handlePersonalisedPromptChange}
                  id="personalised-input"
                  className="translation-input"
                />
                <button
                  className="translation-button"
                  onClick={handlePersonalisedPromptClick}
                  id="personalised-input-button"
                >
                  Set Prompt
                </button>
              </div>
              <div className="translation-container">
                <label className="font-bold text-sm">
                  Your prompt: {updatedPrompt}
                </label>
              </div>
            </div>
          )}

          {/* To be reinstalled when BatchProcessing is up
          //Use BatchProcessing component 
          <MyDropzone
            feature={func.value}
            naming={func.naming}
            deploymentId={selectedOption.deploymentName}
            userInfo={userInfo}
            model={selectedOption.value}
          />
          */}

          {/*Temporary Dropzone*/}
          <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
            {({getRootProps, getInputProps}) => (
              <section className="drop">
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>THIS IS A TEMPORARY DROPZONE</p>
                  <p>Drag and drop some files here, or click to select files. Only .pdf or .txt files are accepted.</p>
                </div>
              </section>
            )}
          </Dropzone>
          <br></br>
        </div>
      </div>

    </>
  );
}

export default BatchFileQueryPage;
