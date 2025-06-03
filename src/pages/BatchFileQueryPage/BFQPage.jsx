import React, { useState } from "react";
import "./BFQPage.css";
import TopBar from "../../components/TopBar/TopBar";

function BFQPage(){

    const [feature, setFeature] = useState('')

    const featureAction = (e) => {
        setFeature(e);
    }

    return (
        <div className="page">
            <TopBar />

            <div className="BFQIntro">
                <h2>
                    Batch File Query can handle
                </h2>
                <ul>
                    <li>Summary of Batch Files</li>
                    <li>Extract Keywords</li>
                    <li>Translate</li>
                    <li>Personalise Prompt</li>
                </ul>
            </div>

            <div>
            
            </div>
        </div>
    );
}

export default BFQPage;
