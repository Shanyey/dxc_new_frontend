import React, { useState } from "react";
import "./Chat.css";
import TopBar from "../../components/TopBar/TopBar";
import SendIcon from "../../assets/icons/send-icon.png";
import UploadIcon from "../../assets/icons/upload-icon.png";
import OptionsIcon from "../../assets/icons/options-icon.png";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function HomePage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const fileInputRef = React.useRef();
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");

    try {
      const formData = new FormData();
      formData.append("query", input);
      formData.append("history", JSON.stringify(messages));
      formData.append("max_tokens", 128000); // to be calculated based on query
      formData.append("model", "gpt-4o"); // TBC if the user can choose the model
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axios.post(
        "http://127.0.0.1:5000/chat",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", response.data);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            typeof response.data === "string"
              ? response.data
              : response.data.output,
          image_base64:
            typeof response.data === "object" && response.data.image_base64
              ? response.data.image_base64
              : undefined,
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
      setFiles((prevFiles) => [...prevFiles, file]);
    }
  };

  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="page">
      <TopBar />

      {messages.length === 0 ? (
        <div className="container-fluid p-4">
          <div className="text-center mt-5">
            <div>
              <p className="welcome text-muted">Ready whenever you are.</p>
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />
              <div className="buttons">
                <div className="left-buttons">
                <button
                  type="button"
                  className="plus"
                  onClick={handlePlusClick}
                  title="Attach file"
                >
                  <img src={UploadIcon} alt="Upload" className="upload-icon" />
                </button>
                <button type="button" className="plus" title="Options"  onClick={() => setShowDropdown((prev) => !prev)}>
                  <img src={OptionsIcon} alt="Options" className="options-icon" />
                </button>
                {showDropdown && (
                  <div className="dropdown-design"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div
                      className="dropdown-menu-custom chat-dropdown"
                      onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                      <button
                        type="button"
                        className="dropdown-item chat-dropdown-item"
                        onClick={() => {
                          setInput("Create an image of");
                          setShowDropdown(false);
                        }}
                      >
                        Image Generation
                      </button>
                      <button
                        type="button"
                        className="dropdown-item chat-dropdown-item"
                        onClick={() => {
                          setInput("Search on the web to");
                          setShowDropdown(false);
                        }}
                      >
                        Web Search
                      </button>
                    </div>
                  </div>
                )}
                </div>
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
                  <div>
                    {msg.image_base64 ? (
                      <img
                        src={`data:image/png;base64,${msg.image_base64}`}
                        alt="result"
                        style={{
                          maxWidth: "100%",
                          marginTop: "10px",
                          borderRadius: "10px",
                        }}
                      />
                    ) : msg.content ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      <p>No result yet.</p>
                    )}
                  </div>
                  {/* <img
                    src={`data:image/png;base64,${msg.image_base64}`}
                    alt="result"
                    style={{
                      maxWidth: "100%",
                      marginTop: "10px",
                      borderRadius: "10px",
                    }}
                  /> */}
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />
              <div className="buttons">
                <div className="left-buttons">
                <button
                  type="button"
                  className="plus"
                  onClick={handlePlusClick}
                  title="Attach file"
                >
                  <img src={UploadIcon} alt="Upload" className="upload-icon" />
                </button>
                <button type="button" className="plus" title="Options"  onClick={() => setShowDropdown((prev) => !prev)}>
                  <img src={OptionsIcon} alt="Options" className="options-icon" />
                </button>
                {showDropdown && (
                  <div className="dropdown-design"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div
                      className="dropdown-menu-custom chat-dropdown"
                      onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                      <button
                        type="button"
                        className="dropdown-item chat-dropdown-item"
                        onClick={() => {
                          setInput("Create an image");
                          setShowDropdown(false);
                        }}
                      >
                        Image Generation
                      </button>
                      <button
                        type="button"
                        className="dropdown-item chat-dropdown-item"
                        onClick={() => {
                          setInput("Search real-time");
                          setShowDropdown(false);
                        }}
                      >
                        Real Time Search
                      </button>
                    </div>
                  </div>
                )}
                </div>
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
        </div>
      )}
    </div>
  );
}

export default HomePage;
