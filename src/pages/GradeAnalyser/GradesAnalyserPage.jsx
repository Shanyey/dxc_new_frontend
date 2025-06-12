import React, { useState, useEffect } from "react";
import "./GradesAnalyserPage.css";
import Dropzone from "../../components/DropZone/DropZone";
// import { auth } from '../Firebase';
import TopBar from "../../components/TopBar/TopBar";
import axios from "axios";

const GradesAnalyser = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [transcriptFiles, setTranscriptFiles] = useState([]);
  //const [userInfo, setUserInfo] = useState();
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractStatus, setExtractStatus] = useState("");

  //Temporarily disabled
  /*
    useEffect(() => {
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
    }, []);
    */

  const handleGradesExtraction = async () => {
    const formData = new FormData();
    transcriptFiles.forEach((file) => {
      formData.append("transcripts", file);
    });

    try {
      setIsExtracting(true); // Start spinner
      setExtractStatus("");

      const response = await axios.post(
        "http://127.0.0.1:5000/grades",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob", // If you expect a file (like Excel) in response
        }
      );

      // Download the Excel file
      const blob = new Blob([response.data]);
      const disposition = response.headers["content-disposition"];
      const fileName = disposition
        ? disposition.split("filename=")[1].replace(/["]/g, "")
        : "transcript_output.xlsx";

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();

      setExtractStatus("Grades have been extracted successfully.");
      setTranscriptFiles([]);
    } catch (error) {
      console.error("Error submitting files:", error);
      alert("There was an error processing the files.");
    } finally {
      setIsExtracting(false); // Stop spinner
    }
  };
  return (
    <div className="page">
      <TopBar />
      <div className="container-fluid p-4">
        <h1 className="title">Grades Analyser</h1>

        <div className="upload-section">
          <div className="upload-container">
            <div className="upload-box">
              <h2 className="upload-title">Upload Transcripts</h2>
              <Dropzone
                acceptedFileTypes={[
                  "application/pdf",
                  "image/png",
                  "image/jpeg",
                ]}
                files={transcriptFiles}
                setFiles={setTranscriptFiles}
              />
            </div>
          </div>

          <div className="button-container">
            {transcriptFiles.length === 0 && !isExtracting && (
              <p className="disabled-message">
                Please upload transcript files to enable extraction
              </p>
            )}
            <button
              onClick={handleGradesExtraction}
              className="extract-button"
              disabled={isExtracting || transcriptFiles.length === 0}
            >
              {isExtracting ? "Extracting..." : "Extract Grades"}
            </button>
          </div>

          {isExtracting && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Extracting Grades...</p>
            </div>
          )}

          {extractStatus && (
            <div className="status-message">
              <p>{extractStatus}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradesAnalyser;
