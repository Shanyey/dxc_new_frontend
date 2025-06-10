import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./MultiMediaDropZone.css";


const MultiMediaDropzone = ({ 
  acceptedFileTypes = [
    "application/pdf",
    "text/plain",
    "video/mp4",
    "video/*"
  ],
  onTranscriptAdd,
  userMail,
  setStatusMessage,
  setStatusType,
  isUploading,
  setIsUploading,
  handleReset,
  isResetting
}) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  // filesData stores objects with: { file, summary, isUploading, errorMessage }
  const [filesData, setFilesData] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    // Filter out duplicates by file name
    const newFiles = acceptedFiles.filter(file =>
      !filesData.some(existing => existing.file.name === file.name)
    ).map(file => ({
      file,
      summary: "",
      isUploading: false,
      errorMessage: ""
    }));
    setFilesData(prev => [...prev, ...newFiles]);
  }, [filesData]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.join(",")
  });

  const handleDelete = (fileName) => {
    setFilesData(prev => prev.filter(item => item.file.name !== fileName));
  };

  const uploadFile = async (fileObj, index) => {
    setFilesData(prev => {
      const newArr = [...prev];
      newArr[index].isUploading = true;
      newArr[index].errorMessage = "";
      return newArr;
    });

    const formData = new FormData();
    formData.append("username", userMail);
    setIsUploading(true);
    // Check file type to decide which endpoint to use
    if (fileObj.file.type.startsWith("video/")) {
      // Video upload logic (Media Analyzer)
      formData.append("video", fileObj.file, fileObj.file.name);
      try {
        const response = await fetch(`${baseUrl}/transcribe-video`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStatusMessage('File(s) uploaded successfully.');
        setStatusType('success');
        setFilesData(prev => {
          const newArr = [...prev];
          newArr[index].fileName = fileObj.file.name;
          newArr[index].summary = data.summary;
          newArr[index].isUploading = false;
          return newArr;
        });
        if (onTranscriptAdd) onTranscriptAdd(data.summary, fileObj.file.name);
      } catch (error) {
        console.error("Error uploading video:", error);
        setStatusMessage('Unable to upload files.');
        setStatusType('error');
        setFilesData(prev => {
          const newArr = [...prev];
          newArr[index].errorMessage = "Error uploading video";
          newArr[index].isUploading = false;
          return newArr;
        });
      }
      finally {
        setIsUploading(false);
      };
    } else {
      // Non-video upload logic (Documents)
      if (fileObj.file.type === "text/plain") {
        // Read file content and normalize line endings
        const text = await fileObj.file.text();
        const normalizedText = text.replace(/\r/g, "\n");
        const normalizedBlob = new Blob([normalizedText], { type: "text/plain" });
        formData.append("file", normalizedBlob, fileObj.file.name);
      } else {
        formData.append("file", fileObj.file, fileObj.file.name);
      }
      try {
        const response = await fetch(`${baseUrl}/upload_documents`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStatusMessage('File(s) uploaded successfully.');
        setStatusType('success');
        setFilesData(prev => {
          const newArr = [...prev];
          newArr[index].summary = data.summary || data.message || "";
          newArr[index].isUploading = false;
          return newArr;
        });
      } catch (error) {
        console.error("Error uploading document:", error);
        setStatusMessage('Unable to upload files.');
        setStatusType('error');
        setFilesData(prev => {
          const newArr = [...prev];
          newArr[index].errorMessage = "Error uploading file";
          newArr[index].isUploading = false;
          return newArr;
        });
      }
      finally {
        setIsUploading(false);
      };
    }
  };

  const uploadAllFiles = async () => {
    for (let i = 0; i < filesData.length; i++) {
      if (!filesData[i].isUploading && !filesData[i].summary) {
        await uploadFile(filesData[i], i);
      }
    }
  };

  return (
    <div className="dropzone-container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <div className="icon">
          
        </div>
        <p>Drag & Drop files here ({acceptedFileTypes.join(", ")})</p>
        <p>or</p>
        <button type="button" className="browse-button">Browse Files</button>
      </div>

      {/* Display dropped files */}
      <div className="dropped-files" style={{ marginTop: "1rem" }}>
        {filesData.map((item) => (
          <div
            key={item.file.name}
            className="file-item"
            // Ensure the children are arranged in a column
            style={{ marginBottom: "1rem", display: "flex", flexDirection: "column" }}
          >
            {/* Header container with file name and clear icon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <span style={{ fontWeight: "bold" }}>{item.file.name}</span>
              <button
                type="button"
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.file.name);
                }}
              >
                
              </button>
            </div>
            
            {/* Error message, if any */}
            {item.errorMessage && (
              <div className="error-message" style={{ marginTop: "0.5rem" }}>
                <p style={{ margin: 0 }}>{item.errorMessage}</p>
              </div>
            )}
            
            {/* Summary placed in its own block */}
            {item.summary && (
              <div className="summary" style={{ marginTop: "0.5rem", display: "block", width: "100%" }}>
                <h4 style={{ margin: 0 }}>Summary:</h4>
                <p style={{ margin: 0 }}>{item.summary}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Button container below the file list */}
      {filesData.length > 0 && (
        <div
          className="upload-buttons"
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "1rem",
          }}
        >
          <button style={{ maxWidth: '45%' }} variant="contained" onClick={uploadAllFiles}>
            {isUploading ? (
              <Oval
                visible={true}
                height="20"
                width="20"
                color="#4fa94d"
                secondaryColor="#4fa94d"
                ariaLabel="oval-loading"
              />
            ) : (
              "Upload All Files"
            )}
          </button> 
          <button style={{maxWidth: '45%'}} onClick={handleReset} disabled={isResetting}>
            {isResetting ? (
                <Oval
                    visible={true}
                    height="20"
                    width="20"
                    color="#4fa94d"
                    secondaryColor="#4fa94d"
                    ariaLabel="oval-loading"
                />
            ) : "Reset"}
         </button>
        </div>
      )}
    </div>
  );
};

export default MultiMediaDropzone;