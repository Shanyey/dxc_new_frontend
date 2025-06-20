import React, { useState, useEffect } from "react";
import "./AIRA_InsightsDisplay.css";
import YouTubeVideoCard from "./YouTubeVideoCard";
import Stepper from 'react-stepper-horizontal';
import CircularProgress from "@mui/material/CircularProgress";
import DownArrow from "../../assets/icons/down-arrow.png";
import UpArrow from "../../assets/icons/up-arrow.png";

function DeepInsightsDisplay({ 
  overview, 
  fileInfo, 
  insights, 
  rerankedArticles, 
  rerankedVideos, 
  uploadedVideos,
  userArticles,
  userVideos,
  query,
  handleDocumentsGeneration,
  addMediaAnalysis,
  handleBackToPreviousStep,
}) {
  
  //const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const baseUrl = "http://127.0.0.1:5000"

  const [articleInclusions, setArticleInclusions] = useState(
    rerankedArticles ? rerankedArticles.map(() => true) : []
  );
  const [videoInclusions, setVideoInclusions] = useState(
    rerankedVideos ? rerankedVideos.map(() => true) : []
  );
  const [uploadedVideoInclusions, setUploadedVideoInclusions] = useState(
    uploadedVideos ? uploadedVideos.map(() => true) : []
  );
  const [userVideoInclusions, setUserVideoInclusions] = useState((userVideos || []).map(() => true));
  const [userArticleInclusions, setUserArticleInclusions] = useState((userArticles || []).map(() => true));
  const [mediaAnalysis, setMediaAnalysis] = useState({});
  const [mediaLoading, setMediaLoading] = useState({});
  const [addedMedia, setAddedMedia] = useState({});

  useEffect(() => {
    setArticleInclusions(rerankedArticles ? rerankedArticles.map(() => true) : []);
  }, [rerankedArticles]);

  useEffect(() => {
    setVideoInclusions(rerankedVideos ? rerankedVideos.map(() => true) : []);
  }, [rerankedVideos]);

  useEffect(() => {
    setUploadedVideoInclusions(uploadedVideos ? uploadedVideos.map(() => true) : [])
  }, [uploadedVideos]);

  const toggleArticleInclusion = (index) => {
    setArticleInclusions((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const toggleVideoInclusion = (index) => {
    setVideoInclusions((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const toggleUserVideoInclusion = (index) => {
    setUserVideoInclusions((prevState) => {
        const newState = [...prevState];
        newState[index] = !newState[index];
        return newState;
    });
};

const toggleUserArticleInclusion = (index) => {
    setUserArticleInclusions((prevState) => {
        const newState = [...prevState];
        newState[index] = !newState[index];
        return newState;
    });
};

  async function handleAnalyzeMedia(articleIndex, imageUrls, query) {
    setMediaLoading(prev => ({ ...prev, [articleIndex]: true }));
    try {
        const response = await fetch(`${baseUrl}/analyze_external_images`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ image_urls: imageUrls, query: query }),
        });
        if (!response.ok) {
            throw new Error("Image analysis failed");
        }
        const analysisResult = await response.json();
        setMediaAnalysis(prev => ({
          ...prev,
          [articleIndex]: analysisResult.responses,
        }));
      } catch (error) {
        console.error("Error analyzing media:", error);
        setMediaAnalysis(prev => ({
          ...prev,
          [articleIndex]: ["Error analyzing media"],
        }));
      } finally {
        setMediaLoading(prev => ({ ...prev, [articleIndex]: false }));
      }
  }

  return (
    <div className="insights-container" style={{padding: "2rem"}}>
      <div className="insights-header-container">
        <Stepper
          steps={[
              { title: "Input Query" },
              { title: "Analyse Data" },
              { title: "Report/Powerpoint" },
          ]}
          activeStep={1}
      />
      {/* Overview and Additional Insights */}
      <div className="overview-container">
          <p className="insights-header">Overview: </p>
          {overview}
        
          <p className="insights-header">Additional Insights: </p>
          {insights}
        </div>
      </div>

      {/* Ranked Articles portion */}
      <div className="insights-content">
        <h3 className="insights-title">Ranked Articles</h3>
        {(rerankedArticles || []).map((article, index) => (
          <div key={index} className="insights-item">
            <h3 className="insights-header">
              {index+1}{") "}{article.title}
              <p className="score-text">
                [Relevance Score (out of 5): {article.score.toFixed(2)}]
              </p>
            </h3>
            <p>{article.summary}</p>
            <p>{article.source && (
                <a href={article.source} target="_blank" rel="noopener noreferrer">
                  See Full Article
                </a>
              )}</p>
            <div className="additional_actions">
              <button
                variant="contained"
                onClick={() => toggleArticleInclusion(index)}
                className="btn option"
                style={{
                  backgroundColor: articleInclusions[index] ? "#4caf50" : "#f44336", // red if included, green if excluded
                  color: "#fff"
                }}
              >
                {articleInclusions[index] ? "Exclude from Report" : "Add to Report"}
              </button>
  
              {article.images && article.images.length > 0 && (
                <div>
                  <button
                    variant="contained"
                    className="analyze-media-btn"
                    disabled={mediaLoading[index]}
                    onClick={() => {
                      if (mediaAnalysis[index]) {
                        // Hide analysis if already shown
                        (prev => ({ ...prev, [index]: undefined }));
                      } else {setMediaAnalysis
                        handleAnalyzeMedia(index, article.images, article.title, query);
                      }
                    }}
                  >
                    {mediaLoading[index] ? (
                      <CircularProgress size={20} />
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                        Analyze source media
                        <img
                          className="down-arrow-btn"
                          src={mediaAnalysis[index] ? UpArrow : DownArrow}
                          alt={mediaAnalysis[index] ? "Hide analysis" : "Show analysis"}
                        />
                      </span>
                    )}
                  </button>
                  <br/> <br/>
                  {mediaAnalysis[index] && (
                    <div>
                    <p>The media here has been filtered and may not be accurate. To view all source media, see full article using the link above.</p>
                    <div
                      className="media-analysis-card-group"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "1rem",
                        marginTop: "1rem",
                        overflowX: "auto",
                        paddingBottom: "1rem",
                        scrollbarWidth: "thin"
                      }}
                    > 
                      {article.images.map((img, idx) => {
                        const key = `${index}-${idx}`;
                        const analysisObj = mediaAnalysis[index]?.[idx];
                        const analysisText = analysisObj?.analysis?.toLowerCase() || "";

                        if (
                          !analysisObj ||
                          !analysisText.trim() ||
                          analysisText.includes("unrelated") ||
                          analysisText.includes("not directly related") ||
                          /\bno\b/.test(analysisText) ||
                          /\bnot\b/.test(analysisText) ||
                          analysisText.includes("can't")
                        ) {
                          return null;
                        }

                        return (
                          <div
                            key={idx}
                            className="media-card"
                            style={{
                              width: "18rem",
                              minHeight: "320px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              borderRadius: "8px",
                              border: "1px solid #eee",
                              backgroundColor: "#fff",
                              padding: "1rem",
                              position: "relative",
                              flex: "0 0 auto" // Prevent shrinking, allow horizontal scroll
                            }}
                          >
                            <img
                              src={img}
                              alt={`Article ${index + 1} image ${idx + 1}`}
                              style={{
                                width: "100%",
                                height: "140px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                marginBottom: "1rem",
                              }}
                            />
                            <div
                              className="media-analysis-item"
                              style={{
                                flex: 1,
                                width: "100%",
                                border: "none",
                                padding: "0",
                                backgroundColor: "transparent",
                                marginBottom: "1rem",
                                fontSize: "0.95rem",
                                color: "#333",
                              }}
                            >
                              {analysisObj.analysis}
                            </div>
                            <button
                              variant="outlined"
                              className="btn option"
                              onClick={() => {
                                const analysisObjForAdd = {
                                  articleTitle: article.title,
                                  source: article.source || "Unknown source",
                                  image_url: img,
                                  image_urls: article.images,
                                  analysis: analysisObj.analysis,
                                };
                                if (addedMedia[key]) {
                                  setAddedMedia((prev) => ({ ...prev, [key]: false }));
                                } else {
                                  addMediaAnalysis(analysisObjForAdd);
                                  setAddedMedia((prev) => ({ ...prev, [key]: true }));
                                }
                              }}
                              sx={{ marginLeft: 1 }}
                              style={{
                                backgroundColor: addedMedia[key] ? "#4caf50" : "#f44336",
                                color: "#fff",
                                width: "140px",
                                border: "none",
                                borderRadius: "4px",
                                padding: "0.5rem 0",
                                cursor: "pointer",
                              }}
                            >
                              {addedMedia[key] ? "Exclude from Report" : "Add to Report"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {userArticles.length === 0 || userVideos === 0 ? null  : <h3 className="insights-title"> Your Provided Articles </h3>}
        {/*User articles*/}
        {userArticles && userArticles.length > 0 && (
          <div className="insights-item">
            {userArticles.map((article, index) => {
              // Create a unique key for user articles (prefix with "user-")
              const userKey = `user-${index}`;
              return (
                <div key={index}>
                  <h3 className="insights-header">
                    {index+1}{") "}{article.title}
                  </h3>
                  <p>{article.summary}</p>
                  <div className="provided-insights-bottom">
                  {article.url && (
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        See Full Article
                      </a>
                    )}
                  <button
                    variant="contained"
                    onClick={() => toggleUserArticleInclusion(index)}
                    className="btn option"
                    style={{
                      backgroundColor: userArticleInclusions[index] ? "#4caf50" : "#f44336",
                      color: "#fff"
                    }}
                  >
                    {userArticleInclusions[index] ? "Exclude from Report" : "Add to Report"}
                  </button>
                  </div>
                  {/* ANALYZE MEDIA SECTION FOR USER PROVIDED ARTICLES */}
                  {article.images && article.images.length > 0 && (
                    <div>
                      <button
                        variant="contained"
                        className="analyze-media-btn"
                        disabled={!!mediaLoading[userKey]}
                        onClick={() => {
                          if (mediaAnalysis[userKey]) {
                            // Hide analysis if already shown
                            (prev => ({ ...prev, [index]: undefined }));
                          } else {setMediaAnalysis
                            handleAnalyzeMedia(index, article.images, article.title, query);
                          }
                        }}
                        sx={{ float: "left", marginBottom: 2 }}
                      >
                        {mediaLoading[userKey] ? (
                          <CircularProgress size={20} />
                        ) : (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                            Analyze source media
                            <img
                              className="down-arrow-btn"
                              src={mediaAnalysis[index] ? UpArrow : DownArrow}
                              alt={mediaAnalysis[index] ? "Hide analysis" : "Show analysis"}
                            />
                          </span>
                        )}
                      </button>
                      <br /> <br />
                      {mediaAnalysis[userKey] && (
                        <div>
                          <p>The media here has been filtered and may not be accurate. To view all source media, see full article using the link above.</p>
                        <div
                          className="media-analysis-card-group"
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "1rem",
                            marginTop: "1rem",
                            overflowX: "auto",
                            paddingBottom: "1rem",
                            scrollbarWidth: "thin"
                        }}
                        >
                          {article.images.map((img, idx) => {
                            // Create a unique key for this media item using userKey.
                            const key = `${userKey}-${idx}`;
                            const analysisObj = mediaAnalysis[userKey]?.[idx];
                            const analysisText = analysisObj?.analysis?.toLowerCase() || "";

                            if (
                              !analysisObj ||
                              !analysisText.trim() ||
                              analysisText.includes("unrelated") ||
                              analysisText.includes("not directly related") ||
                              /\bno\b/.test(analysisText) ||
                              /\bnot\b/.test(analysisText) ||
                              analysisText.includes("can't")
                            ) {
                              return null;
                            }

                            return (
                              <div
                                key={idx}
                                className="media-item"
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  marginBottom: "1rem",
                                }}
                              >
                                <img
                                  src={img}
                                  alt={`Article ${index + 1} image ${idx + 1}`}
                                  style={{
                                    width: "30%",
                                    height: "auto",
                                    objectFit: "cover",
                                    marginRight: "1rem",
                                  }}
                                />
                                <div
                                  className="media-analysis-item"
                                  style={{
                                    flex: 1,
                                    border: "1px solid #ccc",
                                    padding: "8px",
                                    borderRadius: "4px",
                                    backgroundColor: "#f9f9f9",
                                  }}
                                >
                                  {analysisObj.analysis}
                                </div>
                                <button
                                  variant="outlined"
                                  onClick={() => {
                                    const analysisData = {
                                      articleTitle: article.title,
                                      source: article.source || "Unknown source",
                                      image_url: img,
                                      image_urls: article.images,
                                      analysis: analysisObj.analysis,
                                    };
                                    if (addedMedia[key]) {
                                      // Toggle undo adding
                                      setAddedMedia((prev) => ({ ...prev, [key]: false }));
                                    } else {
                                      addMediaAnalysis(analysisData);
                                      setAddedMedia((prev) => ({ ...prev, [key]: true }));
                                    }
                                  }}
                                  sx={{ marginLeft: 1 }}
                                  style={{
                                    backgroundColor: addedMedia[key] ? "#4caf50" : "#f44336", // red if added, green if not
                                    color: "#fff"
                                  }}
                                >
                                  {addedMedia[key] ? "Exclude from Report" : "Add to Report"}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                        </div>
                      )}
                    </div>
                  )}
                  <br />
                </div>
              );
            })}
          </div>
        )}
        <h3 className="insights-title">Ranked Videos</h3>
        {(rerankedVideos ||[]).map((video, index) => (
          <div key={index} className="insights-item" style={{marginTop: '2rem', marginBottom: '2rem'}}>
            <h3 className="insights-header">
              {index+1}{") "}{video.title}{" "}
            </h3>
            <p className="score-text">
                [Relevance Score (out of 5): {video.score.toFixed(2)}]
            </p>
            <YouTubeVideoCard
                key={index}
                videoUrl={video.url}
                videoId={video.videoId}
                title={video.title}
                author={video.author}
                published={video.published_date}
                summary={video.summary}
                duration={video.duration}
                transcription={video.content}
                isIncluded={videoInclusions[index]}
                toggleInclusion={() => toggleVideoInclusion(index)}
            />
            {video.source && (
                <a href={video.source} target="_blank" rel="noopener noreferrer">
                  Watch Full Video
                </a>
              )}
            <button
              className="btn option"
              variant="contained"
              onClick={() => toggleVideoInclusion(index)}
              style={{
                float: 'right',
                maxWidth: '45%',
                backgroundColor: videoInclusions[index] ? "#4caf50" : "#f44336",
                color: "#fff",
                marginBottom: 2
              }}
            >
              {videoInclusions[index] ? "Exclude from Report" : "Add to Report"}
            </button>
            <br /><br />
          </div>
        ))}
      </div>
      {/*User videos*/}
      {userVideos && userVideos.length > 0 && (
      <div className="insights-videos">
          <h3 className="insights-header"> Your provided videos: </h3>
          {userVideos.map((video, index) => (
              <YouTubeVideoCard
                  key={index}
                  videoUrl={video.url}
                  videoId={video.videoId}
                  title={video.title}
                  author={video.author}
                  published={video.published_date}
                  summary={video.summary}
                  duration={video.duration}
                  transcription={video.transcription}
                  isIncluded={userVideoInclusions[index]} // Pass down the inclusion state
                  toggleInclusion={() => toggleUserVideoInclusion(index)} // Pass down the toggle function
            />
          ))}
      </div>
      )}
      {uploadedVideos && uploadedVideos.length > 0 && (
        <div className="insights-document-container">
          <h3 className="insights-title">Uploaded Video Summaries</h3>
          {uploadedVideos.map((video, index) => (
            <div key={`uploaded-video-${index}`} className="insights-item">
              <h3 className="insights-header">
                {index+1}{") "}{video.title}
              </h3>
              <p>{video.summary}</p>
              {video.source && (
                  <a href={video.source} target="_blank" rel="noopener noreferrer">
                    Watch Full Video
                  </a>
                )}
            </div>
          ))}
        </div>
      )}

      {fileInfo && (
        <div className="insights-document-container">
          <h3 className="insights-title">Uploaded Document Summary</h3>
          <p>
            <span className="insights-header">File Info: </span>
            {fileInfo}
          </p>
        </div>
      )}
      
      <div className="insights-btn-container">
        <button
          className="btn btn-danger"
          style={{ textDecoration: 'none', color: 'white' }}
          onClick={handleBackToPreviousStep}
        >
          Back to AIRA Input Query
        </button>
        <button
        className="btn btn-success"
        onClick={(e) =>
          handleDocumentsGeneration(e, { articleInclusions, videoInclusions, userArticleInclusions, userVideoInclusions, uploadedVideoInclusions })
          }
        >
          Generate Report & Powerpoint
        </button>
      </div>
    </div>
  );
}

export default DeepInsightsDisplay;