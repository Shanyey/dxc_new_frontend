import React, { useState } from "react";
import "./Chat.css";
import TopBar from "../../components/TopBar/TopBar";
import SendIcon from "../../assets/icons/send-icon.png";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function HomePage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const fileInputRef = React.useRef();

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    setMessages([...messages, { role: "user", content: input }]);
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
          // sender: "system",
          // text: response.data,
          role: "assistant",
          content: response.data.output,
          image_base64: response.data.image_base64,
        },
      ]);
      console.log("Content:", response.data.output);
      console.log("image:", response.data.image_base64);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          // sender: "system",
          // text: error.messages,
          role: "assistant",
          content: error.message,
        },
      ]);
    }
  };

  const handlePlusClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    // Handle file selection here
    const file = e.target.files[0];
    if (file) {
      // Do something with the file
      console.log("Selected file:", file);
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
            </div>
          </div>

          <form onSubmit={handleSend} className="textbox">
            <div className="chatgpt">
              <textarea
                rows="1"
                className="inputbox"
                value={input}
                onChange={handleChange}
                placeholder="Type a message..."
              />
              <div className="buttons">
                <button
                  type="button"
                  className="plus"
                  onClick={handlePlusClick}
                  title="Attach file"
                >
                  +
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <button className="submit btn rounded-pill" type="submit">
                  <img src={SendIcon} alt="Send" className="send-icon" />
                </button>
              </div>
            </div>
          </form>
          <p className="warning">
            This webpage is hosted on the public internet domain. Please do not
            query anything sensitive.
          </p>
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
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                  <img
                    src={`data:image/png;base64,${msg.image_base64}`}
                    alt="result"
                    style={{
                      maxWidth: "100%",
                      marginTop: "10px",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="textbox">
            <div className="chatgpt">
              <textarea
                rows="1"
                className="inputbox"
                value={input}
                onChange={handleChange}
                placeholder="Type a message..."
              />
              <div className="buttons">
                <button
                  type="button"
                  className="plus"
                  onClick={handlePlusClick}
                  title="Attach file"
                >
                  +
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <button className="submit btn rounded-pill" type="submit">
                  <img src={SendIcon} alt="Send" className="send-icon" />
                </button>
              </div>
            </div>
          </form>
          <p className="warning">
            This webpage is hosted on the public internet domain. Please do not
            query anything sensitive.
          </p>
        </div>
      )}
    </div>
  );
}

export default HomePage;
