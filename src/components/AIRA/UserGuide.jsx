import React from "react";

const UserGuide = () => {
  const containerStyle = {
    maxHeight: "300px",
    overflowY: "auto",
    border: "1px solid #ccc",
    padding: "1rem",
    margin: "1rem 0",
    backgroundColor: "#f9f9f9",
    textAlign: "left"
  };

    return (
      <>
      <div style={containerStyle}>
        <h2 style={{ marginTop: 0, borderBottom: "2px solid #ccc", paddingBottom: "0.5rem" }}>
          <u>User Guide</u>
        </h2>
        <p>
          <strong>Welcome to AIRA!</strong>
        </p>
        <p>
          <strong>
            <u>How to Use Deep Research:</u>
          </strong>
        </p>
        <ul>
          <li>
            <strong>Step 1:</strong> Enter your query. This will be the main topic of interest for our web-based retrieval results and analysis.
          </li>
          <li>
            <strong>Step 2:</strong> Select the number of results you want returned from the web search. Note that runtime increases as the number of search results increases.
          </li>
          <li>
            <strong>Step 3:</strong> Add in any URLs of your own that you want to include in the analysis.
          </li>
          <li>
            <strong>Step 4:</strong> Upload any additional files for analysis. Document files will be analysed for text content, while videos will be transcribed for audio content analysis.
          </li>
          <li>
            <strong>Step 5:</strong> Once all files are uploaded (if any), submit your query for analysis.
          </li>
        </ul>
        <br/>
        <p>
          <strong>
            <u>Tips:</u>
          </strong>
        </p>
        <ul>
          <li>Use detailed queries for better insights.</li>
          <li>Provide high-quality media links.</li>
          <li>Consult the FAQ section for additional help.</li>
        </ul>
        <br/><br/>
        <p>
          <strong>
            <u>Revewing AI Analysis:</u>
          </strong>
        </p>
        <ul>
          <li>
            <strong>Overall Structure:</strong> Generated content includes:
            <ol>
              <li>1. Overview</li>
              <li>2. Additional Insights</li>
              <li>3. Ranked Articles from the web search</li>
              <li>4. Articles from your provided URLs</li>
              <li>5. Ranked Videos from the web search</li>
              <li>6. Videos from your provided URLs</li>
              <li>7. Your Uploaded Videos</li>
            </ol>
          </li>
          <li>
            <strong>Review the Generated Content:</strong> Review the overview, insights and summary of sources for your analysis.
          </li>
          <li>
            <strong>Examine Detailed Source Contents:</strong> Select and choose which articles and videos to include in report generation.
          </li>
          <li>
            <strong>Analyse Media:</strong> For desired articles, click "ANALYZE SOURCE MEDIA" to get insights on the images and videos embedded in the web source.
          </li>
          <li>
            <strong>Generate Supporting Documents:</strong> Use insights to produce comprehensive reports.
          </li>
        </ul>
        <br/>
        <p>
          <strong>
            <u>Tips:</u>
          </strong>
        </p>
        <ul>
          <li>Web searches are automatically ranked by relevance to your search query.</li>
          <li>Cross-check different sources of information.</li>
          <li>Media processing takes time. Only analyse media from sources that you want to include.</li>
          <li>Websites contain media that are sometimes irrelevant, and sometimes media from websites are unavaible for extraction.</li>
        </ul>
      </div>
    </>
    )
};

export default UserGuide;