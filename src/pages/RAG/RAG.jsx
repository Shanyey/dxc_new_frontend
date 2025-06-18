import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
// import { Oval } from "react-loader-spinner"; // Importing the spinner
import "./Rag.css";
import { useNavigate } from "react-router-dom";
import Dropzone from "../../components/DropZone/DropZone"; // Ensure this path is correct}
import TopBar from "../../components/TopBar/TopBar";
import { getAuth } from "firebase/auth";

const RagPage = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState();
  const [file, setFile] = useState([]);
  const [fileName, setFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isUploading, setIsUploading] = useState(false); // Uploading state
  const [isLoading, setIsLoading] = useState(false); // Chat loading state
  const chatBoxRef = useRef(null);

  const handleReset = () => {
    axios
      .post(`${baseUrl}/test-rag/clear_db`, {
        userEmail: user.email,
      })
      .then((response) => {
        console.log("Database cleared:", response.data.status);
        setChatHistory([]);
        setQuery("");
        setFileName("");
        setUploadStatus("");
        setFile([]);
      })
      .catch((error) => {
        console.error("There was an error clearing the /db folder:", error);
      });
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // const handleFilesAdded = (files) => {
  //   setFile(files);
  //   const fileNames = files.map(file => file.name).join(', ');
  //   setFileName(fileNames);
  // };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (file.length === 0) return; // Don't proceed if no files are selected

    const formData = new FormData();
    file.forEach((f) => {
      if (f.type === "application/pdf" || f.type === "text/plain") {
        formData.append("file", f);
      }
    });
    formData.append("userEmail", user.email);
    setIsUploading(true); // Start spinner

    try {
      const response = await axios.post(
        `${baseUrl}/test-rag/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setIsUploading(false);
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadStatus("Upload failed");
    }
    // try {
    //   const response = await fetch(`${baseUrl}/upload_documents`, {
    //     method: "POST",
    //     body: formData,
    //   });

    //   if (!response.ok) {
    //     throw new Error("Network response was not ok");
    //   }

    //   const res = await response.json();
    //   setUploadStatus(res.status);
    // } catch (error) {
    //   console.error("Error uploading files:", error);
    //   setUploadStatus("Upload failed");
    // } finally {
    //   setIsUploading(false); // Stop spinner
    // }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const newUserMessage = { role: "user", content: query };

    setChatHistory((prevChatHistory) => [...prevChatHistory, newUserMessage]);

    setQuery("");

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${baseUrl}/test-rag/submit`,
        {
          query,
          chat_history: chatHistory,
          userEmail: user.email,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Response from server:", response.data);

      const res = response.data;
      const newAssistantMessage = {
        role: "assistant",
        content: `${res.answer}\n\nSource: ${res.pdf_file_name}, Page: ${res.page_number}`,
      };

      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        newAssistantMessage,
      ]);

      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    } catch (error) {
      console.error("Error querying PDF:", error);
      setIsLoading(false);
      return;
    }
    // try {
    //   const response = await fetch(`${baseUrl}/ask_documents`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       query,
    //       chat_history: chatHistory,
    //       username: userInfo.userMail,
    //     }),
    //   });

    //   if (!response.ok) {
    //     throw new Error("Network response was not ok");
    //   }

    //   const res = await response.json();
    //   const newAssistantMessage = {
    //     role: "assistant",
    //     content: `${res.answer}\n\nSource: ${res.pdf_file_name}, Page: ${res.page_number}`,
    //   };

    //   setChatHistory((prevChatHistory) => [
    //     ...prevChatHistory,
    //     newAssistantMessage,
    //   ]);

    //   if (chatBoxRef.current) {
    //     chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    //   }
    // } catch (error) {
    //   console.error("Error querying PDF:", error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <div className="page">
      <TopBar />
      <div className="container-fluid p-4">
        <h1 className="title">Retrieval Augmented Generation</h1>

        <div className="upload-section">
          <Dropzone
            acceptedFileTypes={["application/pdf", "text/plain"]}
            files={file}
            setFiles={setFile}
          />

          <div className="buttonContainer">
            <button
              onClick={handleFileUpload}
              className="uploadButton"
              aria-label="Upload Files"
            >
              Upload
            </button>
            <button
              onClick={handleReset}
              className="resetButton"
              type="button"
              aria-label="Reset Chat"
            >
              Reset Chat
            </button>
          </div>

          {isUploading && (
            <div className="centeredContent">
              {/* <Oval
                height={40}
                width={40}
                color="#4fa94d"
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#4fa94d"
                strokeWidth={2}
                strokeWidthSecondary={2}
              /> */}
              <p>Uploading...</p>
            </div>
          )}
          {uploadStatus && <p>{uploadStatus}</p>}
        </div>

        <div className="chat-section">
          <h2 className="chatLine">Chat</h2>
          <form onSubmit={handleChatSubmit} className="inputContainer">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about the PDF..."
              className="chatInput"
              aria-label="Chat Input"
            />
            <button
              type="submit"
              className="sendButton"
              aria-label="Send Message"
            >
              Send
            </button>
          </form>
          <div ref={chatBoxRef} className="chatBox">
            {chatHistory.map((msg, index) => (
              <div
                key={msg.id || index}
                className={`message ${
                  msg.role === "user" ? "user" : "assistant"
                }`}
              >
                <p>
                  <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong>{" "}
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="loadingContainer">
            {/* <Oval
              height={40}
              width={40}
              color="#4fa94d"
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#4fa94d"
              strokeWidth={2}
              strokeWidthSecondary={2}
            /> */}
            <p className="loadingText">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RagPage;
