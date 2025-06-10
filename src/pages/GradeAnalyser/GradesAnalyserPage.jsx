import React, { useState, useRef, useEffect } from 'react';
import './GradesAnalyserPage.css';
import Dropzone from '../../components/DropZone/DropZone';
//Temporarily disabled firebase
// import { auth } from '../Firebase';
import { NavLink, useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";

const GradesAnalyser = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const [transcriptFiles, setTranscriptFiles] = useState([]);
    const [userInfo, setUserInfo] = useState();
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractStatus, setExtractStatus] = useState('');

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

    // Submit the files to the backend
  const handleGradesExtraction = async () => {
    if (transcriptFiles.length === 0) {
      alert('Please upload at least 1 transcript for analysis.');
      return;
    }

    const formData = new FormData();
    transcriptFiles.forEach((file) => {
      formData.append('transcripts', file);
    });

    try {
        setIsExtracting(true); // Start spinner
        setExtractStatus("");
        
        // Fetch the Excel file from the backend
        const response = await fetch(`${baseUrl}/grades`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Backend returns a single Excel file (blob)
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = "transcript_output.xlsx"; // Use backend-provided filename or default
        link.click();

        setExtractStatus("Grades have been extracted successfully.");
        setTranscriptFiles([]);

    } catch (error) {
      console.error('Error submitting files:', error);
      alert('There was an error processing the files.');
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
                            acceptedFileTypes={['application/pdf', 'image/png', 'image/jpeg']}
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
                        {isExtracting ? 'Extracting...' : 'Extract Grades'}
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
}

export default GradesAnalyser;
