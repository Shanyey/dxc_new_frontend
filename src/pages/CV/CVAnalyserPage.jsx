import React, { useState, useEffect } from "react";
import "./CVAnalyserPage.css";
import Dropzone from "../../components/DropZone/DropZone.jsx";
//import { auth } from '../Firebase';
import TopBar from "../../components/TopBar/TopBar";
import axios from "axios";

const CVAnalyser = () => {
  //const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [cvFiles, setCvFiles] = useState([]);
  const [jobFiles, setJobFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cvFiles.length === 0 || jobFiles.length === 0) {
      alert("Please upload both CVs and Job descriptions.");
      return;
    }

    //create a FormData object to hold the files
    const formData = new FormData();
    cvFiles.forEach((file) => {
      formData.append("resumes", file);
    });
    jobFiles.forEach((file) => {
      formData.append("jobs", file);
    });

    try {
      setLoading(true);
      setUploadStatus("Processing files...");

      // Send the files to the backend
      const response = await axios.post("http://127.0.0.1:5000/cv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", // If you expect a file (like Excel) in response
      });

      //download & process the file
      const blob = new Blob([response.data]);
      const disposition = response.headers["content-disposition"];
      const fileName = disposition
        ? response.headers
            .get("Content-Disposition")
            .split("filename=")[1]
            .replace(/["]/g, "")
        : "CV_analysis.xlsx";

      // Create a link to download the file
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href); // Clean up

      setUploadStatus("Analysis complete! File downloaded.");

      // Clear the file inputs
      setCvFiles([]);
      setJobFiles([]);
    } catch (error) {
      console.error("Error submitting files:", error);
      setUploadStatus("Error processing files. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <TopBar />
      <div className="container-fluid p-4">
        <h1 className="title">CV Analyser</h1>
        <div className="upload-section">
          <div className="upload-container">
            <div className="upload-box">
              <h2 className="upload-title">Upload CVs (PDF)</h2>
              <Dropzone
                acceptedFileTypes={["application/pdf"]}
                files={cvFiles}
                setFiles={setCvFiles}
              />
            </div>

            <div className="upload-box">
              <h2 className="upload-title">
                Upload Job Description Files (PDF)
              </h2>
              <Dropzone
                acceptedFileTypes={["application/pdf"]}
                files={jobFiles}
                setFiles={setJobFiles}
              />
            </div>
          </div>

          <div className="button-container">
            {(cvFiles.length === 0 || jobFiles.length === 0) && !loading && (
              <p className="disabled-message">
                Please upload both CV and Job Description files to enable
                analysis
              </p>
            )}
            <button
              onClick={handleSubmit}
              className="analyse-button"
              disabled={
                loading || cvFiles.length === 0 || jobFiles.length === 0
              }
            >
              {loading ? "Processing..." : "Analyse"}
            </button>
          </div>

          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Processing files...</p>
            </div>
          )}

          {uploadStatus && (
            <div className="status-message">
              <p>{uploadStatus}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVAnalyser;
