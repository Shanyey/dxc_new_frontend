import React, { useEffect, useState } from "react";
import "./DocumentsDisplay.css";

function DocumentsDisplay({ reportUrl }) {

    return (
        <div className="doc-container">
            <iframe
                className="report"
                title="Generated report pdf"
                src={reportUrl}
            />
        </div>
    );
}

export default DocumentsDisplay;
