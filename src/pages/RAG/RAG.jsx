import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// import { Oval } from 'react-loader-spinner'; // Importing the spinner
import './Rag.css';
import { useNavigate } from "react-router-dom";
import Dropzone from "./DropZone2"; // Ensure this path is correct
//import { auth } from "../Firebase";
import TopBar from "../../components/TopBar/TopBar";

const RagPage = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState();
  const [file, setFile] = useState([]);
  const [fileName, setFileName] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isUploading, setIsUploading] = useState(false); // Uploading state
  const [isLoading, setIsLoading] = useState(false); // Chat loading state
  const chatBoxRef = useRef(null);

  // Checks if user is authenticated
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

  const handleReset = () => {
    axios.post(`${baseUrl}/clear_db`, {
      username: userInfo.userMail
    })
      .then(response => {
        console.log('Database cleared:', response.data.status);
        setChatHistory([]);
        setQuery('');
        setFileName('');
        setUploadStatus('');
        setFile([]);
      })
      .catch(error => {
        console.error('There was an error clearing the /db folder:', error);
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
      if (f.type === 'application/pdf' || f.type === 'text/plain') {
        formData.append('file', f);
      }
    });
    formData.append('username', userInfo.userMail);
    setIsUploading(true); // Start spinner
  
    try {
      const response = await fetch(`${baseUrl}/upload_documents`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const res = await response.json();
      setUploadStatus(res.status);
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadStatus('Upload failed');
    } finally {
      setIsUploading(false); // Stop spinner
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const newUserMessage = { role: 'user', content: query };

    setChatHistory(prevChatHistory => [...prevChatHistory, newUserMessage]);

    setQuery('');

    setIsLoading(true);

    try {
      const response = await fetch(`${baseUrl}/ask_documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, chat_history: chatHistory, username: userInfo.userMail }),
      });
    
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    
      const res = await response.json();
      const newAssistantMessage = { 
        role: 'assistant', 
        content: `${res.answer}\n\nSource: ${res.pdf_file_name}, Page: ${res.page_number}` 
      };
    
    
      setChatHistory(prevChatHistory => [...prevChatHistory, newAssistantMessage]);
    
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    } catch (error) {
      console.error('Error querying PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
        <TopBar />
      <h1 className="title">Retrieval Augmented Generation </h1>
      <p className="ragDescription">Upload your .pdf or .txt documents and chat</p>
     
      
      <Dropzone 
      acceptedFileTypes={['application/pdf', 'text/plain']} 
      // onFilesAdded={handleFilesA
      files={file}
      setFiles={setFile}
      />
      
      <div className="buttonContainer">
        <button onClick={handleFileUpload} className="uploadButton" aria-label="Upload Files">Upload</button>
        <button onClick={handleReset} className="resetButton" type="button" aria-label="Reset Chat">Reset Chat</button>
      </div>
      
      {isUploading && (
        <div className="centeredContent">
          <Oval
            height={40}
            width={40}
            color="#4fa94d"
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
          <p>Uploading...</p>
        </div>
      )}
      {uploadStatus && <p>{uploadStatus}</p>}

      <h2 className="chatLine">Chat</h2>
      <div ref={chatBoxRef} className="chatBox">
        {chatHistory.map((msg, index) => (
          <div key={msg.id || index} className={`message ${msg.role === 'user' ? 'user' : 'assistant'}`}>
            <p><strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong> {msg.content}</p>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleChatSubmit} className="inputContainer">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about the PDF..."
          className="chatInput"
          aria-label="Chat Input"
        />
        <button type="submit" className="sendButton" aria-label="Send Message">Send</button>
      </form>
      
      {isLoading && (
        <div className="loadingContainer">
          <Oval
            height={40}
            width={40}
            color="#4fa94d"
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
          <p className="loadingText">Loading...</p>
        </div>
      )}
    </div>
  );
}

export default RagPage;
