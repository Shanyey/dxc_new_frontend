import React from "react";
import "./NextButton.css";

function NextButton({ buttonText, onClick }) {
    return (
        <button className="next-button" onClick={onClick}>{buttonText}</button>
    );
}

export default NextButton;
