import React, { useEffect, useState } from "react";
import MultiMediaDropzone from "./MultiMediaDropZone";
import "./AIRA_InputQuery.css";
import Stepper from 'react-stepper-horizontal';
import Trash from '../../assets/icons/trash-icon.png';

function InputQuery({ query, setQuery, onSubmit, userInfo, onTranscriptAdd, top_k, handleChangeTopK }) {

    // if (!userInfo) {
    //     return <div>Loading...</div>;
    // }

    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    //const userMail = userInfo.userMail;
    //temporary email
    const userMail = "k@tinnolab.org";

    const [urls, setUrls] = useState([""]);
    

    const handleUrlChange = (index, value) => {
        const newUrls = [...urls];
        newUrls[index] = value;
        setUrls(newUrls);
    };
    const handleAddUrl = () => setUrls([...urls, ""]);
    const handleDeleteUrl = (index) => setUrls(urls.filter((_, idx) => idx !== index));

    async function handleReset() {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/clear_db`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                //body: JSON.stringify({ username: userInfo.userMail })
            });
            if (!response.ok) throw new Error("Network response was not ok");
            const responseData = await response.json();
            if (responseData.success) {
                setStatusMessage("Database reset successfully.");
                setStatusType('success');
            } else {
                setStatusMessage("Failed to reset database.");
                setStatusType('error');
            }
        } catch (error) {
            console.error("Error resetting database:", error);
            setStatusMessage("Failed to reset database.");
            setStatusType('error');
        } finally {
            setIsResetting(false);
        }
    }; 

    useEffect(() => {
        if (statusMessage) {
            const timer = setTimeout(() => setStatusMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [statusMessage]);    

    return (
        <div>
        <div className="container-fluid p-4" >
            <Stepper
                steps={[
                    { title: "Input Query" },
                    { title: "Analyse Data" },
                    { title: "Report/Powerpoint" },
                ]}
                activeStep={0}
            />

            {/* Top K Selector */}
            <div className="results-display">
                <label htmlFor="topK" className="results-text">
                    Select Number of Results:
                </label>
                <select
                    id="topK"
                    value={top_k}
                    onChange={(e) => handleChangeTopK(parseInt(e.target.value, 10))}
                    className="results-number"
                >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </select>
            </div>
        </div>
        <div className="A3-input-container">
            {/* URL Inputs */}
            <div className="url">
                <label className="url-text">Input Relevant URLs: (Optional)</label>
                <div className="inputboxes">
                    {urls.map((url, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center" }}>
                            <input
                                className="url-input"
                                type="text"
                                value={url}
                                onChange={(e) => handleUrlChange(idx, e.target.value)}
                                placeholder={`URL ${idx + 1}`}
                            />
                            {idx === urls.length - 1 && (
                                <button
                                    type="button"
                                    className="add-button"
                                    onClick={handleAddUrl}
                                    aria-label="Add URL"
                                    title="Add URL"
                                >
                                    +
                                </button>
                            )}
                            {urls.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleDeleteUrl(idx)}
                                    style={{
                                        cursor: "pointer",
                                        border: 0,
                                        backgroundColor: "#f8f8f8",
                                        padding: "0.2rem 0.7rem",
                                        borderRadius: "50%",
                                    }}
                                    aria-label="Delete URL"
                                    title="Delete URL"
                                >
                                    <img src={Trash} alt="Delete" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="drop-zone">
                <label className="upload-text">Upload Files (Optional):</label>
                <MultiMediaDropzone
                    acceptedFileTypes={[
                        "application/pdf",
                        "text/plain",
                        "video/mp4",
                        "video/*"
                    ]}
                    onTranscriptAdd={onTranscriptAdd}
                    userMail={userMail}
                    setStatusType={setStatusType}
                    setStatusMessage={setStatusMessage}
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                    handleReset={handleReset}
                    isResetting={isResetting}
                />
            </div>
            
            {/* Query Input */}
            <form className="query-container">
                <div className="query-text">What is your Query?</div>
                <div className="query-input">
                <input
                    type="text"
                    className="inputbox"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            onSubmit(e);
                        }
                    }}
                    placeholder="Type a message..."
                />
                <button
                    className="btn btn-primary rounded-pill"
                    type="submit"
                    disabled={query.trim() === ""}
                    onClick={e => onSubmit(e)}
                >
                    Submit
                </button>
                </div>
            </form>
            {/* Status Message */}
                {statusMessage && (
                    <div className={`status-message ${statusType}`} style={{ marginTop: "1rem", maxWidth: 600 }}>
                        {statusMessage}
                    </div>
            )}
        </div>
    </div>
    );
}

export default InputQuery;