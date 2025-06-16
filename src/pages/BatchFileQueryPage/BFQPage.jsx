import "./BFQPage.css";
import TopBar from "../../components/TopBar/TopBar";
import React, { useState, useEffect, useRef } from "react";
import Dropzone from "../../components/DropZone/DropZone.jsx";
import Select from "react-select";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

function BatchFileQueryPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState();
  const [tooltipEnabled, setTooltipEnabled] = useState(false);
  const [files, setFiles] = useState([]);
  // For users to select the 3 different GPT models: String to identify the model, label: String for Select Dropdown option at the top, deploymentName: to initialise the correct deployment in Azure
  const models = [
    {
      value: "gpt-4o-mini",
      label: "GPT-4o-mini",
      deploymentName: "gpt4-o-mini",
    },
    { value: "gpt-4o", label: "GPT-4o", deploymentName: "gpt4o" },
  ];

  // Default model selected is GPT4o mini
  const [selectedModel, setSelectedModel] = useState(models[0]);

  const [inputLanguage, setInputLanguage] = useState("English");
  const [updatedLanguage, setUpdatedLanguage] = useState(inputLanguage);

  // to handle personalised prompts
  const [personalisedPrompt, setPersonalisedPrompt] = useState("");

  // updated prompt to be set once the user keys in his prompt
  const [updatedPrompt, setUpdatedPrompt] = useState(
    "No personalised prompt set."
  );

  // 4 functions.  value: To be passed into BatchProcessing.jsx component as the prompt. label: String for Select Dropdown option for user to choose function. naming: String to be passed into BatchProcessing.jsx component as props for naming of download file
  const functions = [
    {
      value: "Summarize the following text: ",
      label: "Summarization",
      naming: "sum",
    },
    {
      value: "Extract the keywords from the following text: ",
      label: "Keyword Extraction",
      naming: "key",
    },
    {
      value:
        "Translate the following text to " +
        updatedLanguage +
        ", if it is the same language, just reply with the exact same text:",
      label: "Translation (Summary)",
      naming: "tra",
    },
    {
      value:
        "Perform a verbatim translation to " +
        updatedLanguage +
        ", if it is the same language, just reply with the exact same text:",
      label: "Translation (Verbatim)",
      naming: "verbatim_tra",
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
    setInputLanguage("");
  }

  // upon personalised prompt keyed in and clicked on button
  function handlePersonalisedPromptClick() {
    setUpdatedPrompt(personalisedPrompt);
    setPersonalisedPrompt("");
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

  const handleSubmit = async () => {
    // console.log("Files submitted:", files);
    // console.log("action prompt:", func.value);
    // console.log("Selected model:", selectedModel);
    // console.log("Updated language:", updatedLanguage);
    // console.log("Updated prompt:", updatedPrompt);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("action", func.naming);
    formData.append("actionPrompt", func.value);
    formData.append("model", selectedModel.value); //not sure which field to use yet
    formData.append("language", updatedLanguage);
    formData.append("personalisedPrompt", updatedPrompt);

    const response = await axios.post(
      "http://127.0.0.1:5000/test-bfq",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      }
    );

    // Create a download link for the ZIP file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "llm_responses.zip"); // Set the desired file name
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="page">
        <TopBar />
        <div className="batchfilequery-main-content">
          <div className="BFQIntro">
            <h2>Batch File Query</h2>
          </div>

          <div className="select-container">
            <div className="select-btn">
              <span className="select-text">Select function: </span>
              <Select
                id="select-func"
                value={func}
                onChange={setFunc}
                options={functions}
                placeholder="Select Function"
                className="text-sm"
              />
            </div>

            <div className="select-btn">
              <span className="select-text">Select model: </span>
              <Select
                value={selectedModel}
                onChange={setSelectedModel}
                options={models}
                id="select-model"
                placeholder="Select Model"
              />
            </div>
          </div>

          {/* only renders if user chooses translation */}
          {(func.label == "Translation (Summary)" ||
            func.label == "Translation (Verbatim)") && (
            <div className="translation-container">
              <label>
                Translate to {updatedLanguage} or choose a language to translate
                to :
              </label>
              <input
                type="text"
                placeholder="Input a language"
                id="input-lang"
                value={inputLanguage}
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
                  value={personalisedPrompt}
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

          <Dropzone
            acceptedFileTypes={["application/pdf", "text/plain"]}
            files={files}
            setFiles={setFiles}
          />
          <br></br>

          <button className="submit-button" onClick={handleSubmit} />
        </div>
      </div>
    </>
  );
}

export default BatchFileQueryPage;
