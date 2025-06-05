import React, { useState } from "react";
import "./HomePage.css";
import TopBar from "../../components/TopBar/TopBar";
import TranslationIcon from "../../assets/icons/translation-icon.png";
import URLIcon from "../../assets/icons/url-icon.png";
import ChatIcon from "../../assets/icons/chat-icon.png";
import axios from "axios";

function HomePage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    setMessages([
      ...messages,
      { sender: "user", text: input, role: "user", content: input },
    ]);
    setInput("");

    try {
      const response = await axios.post("http://127.0.0.1:5000/webbrowsing", {
        query: input,
        history: messages,
        max_tokens: 128000, //to be calculated based on query
        model: "gpt-4o-mini", //TBC if the user can choose the model
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin":
            "https://dxcfrontend2.azurewebsites.net",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        },
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          text: response.data,
          role: "assistant",
          content: input,
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          text: error.messages,
          role: "assistant",
          content: input,
        },
      ]);
    }
  };

  return (
    <div className="page">
      <TopBar />

      {messages.length === 0 ? (
        <div className="container-fluid p-4">
          <div className="text-center mt-5">
            <div>
              <p className="welcome">Welcome to DXC</p>
              <p className="text-muted">What would you like to do today?</p>
              <p>Home can handle:</p>
              <div className="cards">
                <div className="card">
                  <div className="card-body">
                    <img src={ChatIcon} className="logo" alt="Chat" />
                    <p className="card-text">Chat</p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <img
                      src={TranslationIcon}
                      className="logo"
                      alt="Translation"
                    />
                    <p className="card-text">Translation</p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <img src={URLIcon} className="logo" alt="URL Query" />
                    <p className="card-text">URL Query</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSend} className="textbox">
            <input
              type="text"
              className="inputbox"
              value={input}
              onChange={handleChange}
              placeholder="Type a message..."
            />
            <button
              className="btn btn-primary rounded-pill"
              type="submit"
              disabled={input.trim() === ""}
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <div className="container-fluid p-4">
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`d-flex ${
                  msg.role === "user"
                    ? "justify-content-end"
                    : "justify-content-start"
                }`}
              >
                <div
                  className={`message-bubble ${
                    msg.role === "user"
                      ? "bg-primary text-white"
                      : "bg-secondary text-white"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="textbox">
            <input
              type="text"
              className="inputbox"
              value={input}
              onChange={handleChange}
              placeholder="Type a message..."
            />
            <button
              className="btn btn-primary rounded-pill"
              type="submit"
              disabled={input.trim() === ""}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default HomePage;
