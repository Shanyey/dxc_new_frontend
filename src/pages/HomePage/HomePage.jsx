import React, { useState } from 'react';
import './HomePage.css';
import TopBar from '../TopBar/TopBar';
import TranslationIcon from '../../assets/translation-icon.png'
import URLIcon from '../../assets/url-icon.png'
import ChatIcon from '../../assets/chat-icon.png'

function HomePage() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim() === '') return;
        setMessages([...messages, { sender: 'user', text: input }]);
        setInput('');
    };

    return (
        <div className="d-flex flex-column vh-100">
            <TopBar />

            {messages.length === 0 ? (
                <div className="container-fluid p-4">
                    <div className="text-center mt-5">
                        <div>
                            <p className="welcome">
                                Welcome to DXC
                            </p>
                            <p className="text-muted">
                                What would you like to do today?
                            </p>
                            <p>
                                Home can handle:
                            </p>
                            <div className="cards d-flex justify-content-center align-items-center gap-4">
                                <div className="card">
                                    <div className="card-body">
                                        <img src={ChatIcon} className="logo" alt="Chat" />
                                        <p className="card-text">Chat</p>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-body">
                                        <img src={TranslationIcon} className="logo" alt="Translation" />
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

                    <form onSubmit={handleSend} className="mt-4 d-flex align-items-center">
                        <input
                            type="text"
                            className="form-control me-2 rounded-pill"
                            value={input}
                            onChange={handleChange}
                            placeholder="Type a message..."
                        />
                        <button className="btn btn-primary rounded-pill" type="submit" disabled={input.trim() === ''}>
                            Send
                        </button>
                    </form>
                </div>
            ) : (
                <>
                    <div className="container-fluid flex-grow-1 overflow-auto p-4">
                        <div className="d-flex flex-column gap-3">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                                >
                                    <div className={`message-bubble ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-secondary text-white'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSend} className="border-top p-3 d-flex align-items-center">
                        <input
                            type="text"
                            className="form-control me-2 rounded-pill"
                            value={input}
                            onChange={handleChange}
                            placeholder="Type a message..."
                        />
                        <button className="btn btn-primary rounded-pill" type="submit" disabled={input.trim() === ''}>
                            Send
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}

export default HomePage;
