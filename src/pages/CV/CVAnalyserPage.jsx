import React, { useState, useRef, useEffect } from 'react';
import './CVAnalyserPage.css';
import Dropzone from '../../components/DropZone/DropZone.jsx';
//Temporarily disabled
//import { auth } from '../Firebase';
import { NavLink, useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";

const CVAnalyser = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [cvFiles, setCvFiles] = useState([]);
  const [jobFiles, setJobFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [uploadStatus, setUploadStatus] = useState('');
  
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

  // const handleCvFilesAdded = (files) => {
  //   setCvFiles(files);
  // }

  // const handleJdFilesAdded = (files) => {
  //   setJobFiles(files);
  // }

  // Submit the files to the backend
  const handleSubmit = async () => {
    if (cvFiles.length === 0 || jobFiles.length === 0) {
      alert('Please upload both CVs and Job descriptions.');
      return;
    }

    const formData = new FormData();
    cvFiles.forEach((file) => {
      formData.append('resumes', file);
    });

    jobFiles.forEach((file) => {
      formData.append('jobs', file);
    });

    try {
      setLoading(true);
      setUploadStatus('Processing files...');

      const response = await fetch(`${baseUrl}/resume`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const fileName = response.headers.get('Content-Disposition')
        ? response.headers
            .get('Content-Disposition')
            .split('filename=')[1]
            .replace(/["]/g, '')
        : 'CV_analysis.xlsx';

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      
      setUploadStatus('Analysis complete! File downloaded.');
    } catch (error) {
      console.error('Error submitting files:', error);
      setUploadStatus('Error processing files. Please try again.');
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
                acceptedFileTypes={['application/pdf']}
                files={cvFiles}
                setFiles={setCvFiles}
              />
            </div>
            
            <div className="upload-box">
              <h2 className="upload-title">Upload Job Description Files (PDF)</h2>
              <Dropzone
                acceptedFileTypes={['application/pdf']}
                files={jobFiles}
                setFiles={setJobFiles}
              />
            </div>
          </div>

          <div className="button-container">
            {(cvFiles.length === 0 || jobFiles.length === 0) && !loading && (
              <p className="disabled-message">
                Please upload both CV and Job Description files to enable analysis
              </p>
            )}
            <button 
              onClick={handleSubmit} 
              className="analyse-button"
              disabled={loading || cvFiles.length === 0 || jobFiles.length === 0}
            >
              {loading ? 'Processing...' : 'Analyse'}
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
