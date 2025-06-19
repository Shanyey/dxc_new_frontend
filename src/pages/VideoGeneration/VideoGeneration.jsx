import React, { useState, useEffect } from "react";
import "./VideoGeneration.css";
import TopBar from "../../components/TopBar/TopBar";
import { getAuth } from "firebase/auth";


const VideoGeneration = () => {

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const auth = getAuth();
    const [loading, setLoading] = useState(false);  
    const [videoUrl, setVideoUrl] = useState(null);
    const [query, setQuery] = useState("");
    const [top_k, setTopK] = useState(5);
    const handleChangeTopK = (k) => {
        setTopK(k)
    };

    //authentication
    // useEffect(() => {
    //     auth.onAuthStateChanged((user) => {
    //     if (user) {
    //         setUserInfo({
    //         userDetails: user.displayName,
    //         userImage: user.photoURL,
    //         userMail: user.email,
    //         });
    //     } else {
    //         navigate("/");
    //     }
    //     });
    // }, []);

    const handlePromptSubmit = async (e) => {
        e.preventDefault();
        if (query.trim() === "") return;
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/video_generation`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                prompt: query,
                weight: 480,
                height: 480,
                n_seconds: top_k,
                }),

            });
            if (!response.ok) {
                throw new Error("Video generation failed");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
        } catch(error) {
            console.error("Error generating video:", error);
            alert("Failed to generate video. Please try again.");
            return;
        } finally {
            setLoading(false)
        }
    }
  
    return (
        <div className="page">
            <TopBar />
            <div className="parameter-selection">
                <div className="select-btn">
                    <span className="select-time">Select Length of Video: </span>
                    <select
                    id="topK"
                    value={top_k}
                    onChange={(e) => handleChangeTopK(parseInt(e.target.value, 10))}
                    className="select-time-dropdown"
                    >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                    </select>
                </div>
                <div>Width: 480px</div>
                <div>Height: 480px</div>
            </div>

            <div>
            <h3 className="vid-gen-prompt">Video Generation Prompt</h3>
            <form onSubmit={handlePromptSubmit} className="promptContainer">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Input your prompt here..."
                className="promptInput"
                aria-label="Chat Input"
                />
                <button
                type="submit"
                className="sendPrompt"
                aria-label="Send Message"
                >
                Send
                </button>
            </form>
            </div>

            {!videoUrl && loading && (
            <div className="loading-screen" style={{ textAlign: "center", margin: "2rem" }}>
                <h2>Generating video, please wait...</h2>
            </div>
            )}

            {videoUrl && !loading && (
            <div className="video-viewer">
                <h1 className="vid-gen-video">Generated Video</h1>
                <div className="video-display">
                <div className="video-container">
                    <video controls className="video-player">
                    <source src={videoUrl} type="video/mp4" />
                    </video>
                </div>
                </div>
            </div>
            )}
        </div>
    )
};

export default VideoGeneration;
