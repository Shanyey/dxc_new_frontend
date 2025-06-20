import React, { useEffect, useState } from "react";
import "./AIRA_DocumentGeneration.css";
import Stepper from 'react-stepper-horizontal';

function DocumentsDisplay({ reportUrl, handleBackToPreviousStep }) {

    return (
        <div className="doc-container">
            <div className="generated-header-container">
                    <Stepper
                      steps={[
                          { title: "Input Query" },
                          { title: "Analyse Data" },
                          { title: "Report/Powerpoint" },
                      ]}
                      activeStep={2}
                  />
            </div>
            <p className="generated-report-text">Please see below for the generated report. </p>
            <iframe
                className="report"
                title="Generated report pdf"
                src={reportUrl}
            />
            <div className="insights-btn-container">
                <button
                className="btn btn-danger"
                style={{ textDecoration: 'none', color: 'white' }}
                onClick={handleBackToPreviousStep}
                >
                Back to AIRA Insights
                </button>
            </div>
        </div>
    );
}

export default DocumentsDisplay;
