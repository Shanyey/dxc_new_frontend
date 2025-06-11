import React, { useState } from "react";

function MediaUpload({onTranscriptAdd}) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setSummary("");
    setErrorMessage("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    if (selectedFile.type.startsWith("video/")) {
      const formData = new FormData();
      formData.append("video", selectedFile);
      setIsUploading(true);
      try {
        const response = await fetch(`${baseUrl}/transcribe-video`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSummary(data.summary);

        if (onTranscriptAdd) onTranscriptAdd(data.summary)
      } catch (error) {
        console.error("Error uploading video:", error);
        setErrorMessage("Error uploading video");
      } finally {
        setIsUploading(false);
      }
    } else {
      setErrorMessage("Unsupported file type. Please upload a video file.");
    }
  };

  return (
    <div
      className="media-upload-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "1rem",
        width: "100%",
      }}
    >
      <div
        style={{
          border: "2px dashed #ccc",
          borderRadius: "10px",
          padding: "2rem",
          width: "100%",
          maxWidth: "500px",
          textAlign: "center",
          backgroundColor: "#fafafa",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2>🎬 Media Upload</h2>
        <input
          type="file"
          onChange={handleFileChange}
          accept="video/*"
          style={{
            margin: "1rem 0",
            width: "100%",
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        />
        <button
          onClick={handleUpload}
          disabled={isUploading}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#4fa94d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: isUploading ? "not-allowed" : "pointer",
            marginBottom: "1rem",
          }}
        >
          {isUploading ? (
            <div></div>
          ) : (
            "Upload and Transcribe"
          )}
        </button>
        {summary && (
          <div
            style={{
              marginTop: "1rem",
              backgroundColor: "#f5f5f5",
              padding: "1rem",
              borderRadius: "5px",
              textAlign: "left",
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            <h3>Summary:</h3>
            <p>{summary}</p>
          </div>
        )}
        {errorMessage && (
          <div
            style={{
              marginTop: "1rem",
              color: "red",
              fontWeight: "bold",
            }}
          >
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default MediaUpload;