import React, { useState, useEffect } from "react";
import "./DeepInsightsDisplay.css";
import YouTubeVideoCard from "./YouTubeVideoCard";
import NextButton from "./NextButton";
import Stepper from 'react-stepper-horizontal';

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
  addMediaAnalysis
}) {
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

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
        <p>
          <span className="insights-header">Overview: </span>
          {overview}
        </p>
        <br />
        <p>
          <span className="insights-header">Additional Insights: </span>
          {insights}
        </p>
      </div>

      <div className="insights-content">
        <h3 className="insights-title">Ranked Articles</h3>
        {(rerankedArticles || []).map((article, index) => (
          <div key={index} className="insights-item">
            <h3 className="insights-header">
              {article.title}{" "}
              <span className="score-text">
                (Relevance Score: {article.score.toFixed(2)})
              </span>
              {article.source && (
                <a href={article.source} target="_blank" rel="noopener noreferrer">
                  {" "}....Read more
                </a>
              )}
            </h3>
            <p>{article.summary}</p>
            <div style={{marginTop: '2rem', marginBottom: '2rem', minHeight: '4rem'}}>
              <Button
                variant="contained"
                onClick={() => toggleArticleInclusion(index)}
                sx={{
                  float: 'right',
                  maxWidth: '45%',
                  backgroundColor: articleInclusions[index] ? "#f44336" : "#4caf50",
                  color: "#fff",
                  marginBottom: 2
                }}
              >
                {articleInclusions[index] ? "Exclude from Report" : "Include in Report"}
              </Button>
              {/* <br /><br /> */}
              {article.images && article.images.length > 0 && (
                <div>
                  <Button
                    variant="contained"
                    disabled={!!mediaLoading[index]}
                    onClick={() => handleAnalyzeMedia(index, article.images, article.title, query)}
                    sx={{ float: 'left', marginBottom: 2 }}
                  >
                    {mediaLoading[index]
                      ? <CircularProgress size={20} />
                      : "Analyze source media"}
                  </Button>
                  <br/> <br/>
                  {mediaAnalysis[index] && (
                    <div className="media-analysis-container" style={{ marginTop: '1rem' }}>
                      {article.images.map((img, idx) => {
                        const key = `${index}-${idx}`;
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
                                marginRight: "1rem"
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
                              {mediaAnalysis[index][idx]
                                ? mediaAnalysis[index][idx].analysis
                                : "No analysis available"}
                            </div>
                            <Button 
                              variant="outlined" 
                              onClick={() => {
                                const analysisObj = {
                                  articleTitle: article.title,  // to match the article in rerankedArticles
                                  source: article.source || "Unknown source",
                                  image_url: img,               // the individual image URL for this analysis item
                                  image_urls: article.images,   // pass the full list of image URLs
                                  analysis: mediaAnalysis[index] && mediaAnalysis[index][idx]
                                            ? mediaAnalysis[index][idx].analysis
                                            : "No analysis available"
                                };
                                if (addedMedia[key]) {
                                  // Toggle undo adding
                                  setAddedMedia(prev => ({ ...prev, [key]: false }));
                                } else {
                                  addMediaAnalysis(analysisObj);
                                  setAddedMedia(prev => ({ ...prev, [key]: true }));
                                }
                              }}
                              sx={{ marginLeft: 1 }}
                            >
                              {addedMedia[key] ? "Added" : "Add to Report"}
                            </Button>
                          </div>
                        );
                      })}
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
                    {article.title}
                    {article.url && (
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        {" "}.... Read more
                      </a>
                    )}
                  </h3>
                  <p>{article.summary}</p>
                  <Button
                    variant="contained"
                    onClick={() => toggleUserArticleInclusion(index)}
                    sx={{
                      float: "right",
                      width: "30%",
                      backgroundColor: userArticleInclusions[index] ? "#f44336" : "#4caf50",
                      color: "#fff",
                      marginBottom: 2,
                    }}
                  >
                    {userArticleInclusions[index] ? "Exclude from Report" : "Include in Report"}
                  </Button>
                  {/* ANALYZE MEDIA SECTION FOR USER PROVIDED ARTICLES */}
                  {article.images && article.images.length > 0 && (
                    <div>
                      <Button
                        variant="contained"
                        disabled={!!mediaLoading[userKey]}
                        onClick={() =>
                          handleAnalyzeMedia(userKey, article.images, query)
                        }
                        sx={{ float: "left", marginBottom: 2 }}
                      >
                        {mediaLoading[userKey] ? (
                          <CircularProgress size={20} />
                        ) : (
                          "Analyze source media"
                        )}
                      </Button>
                      <br /> <br />
                      {mediaAnalysis[userKey] && (
                        <div
                          className="media-analysis-container"
                          style={{ marginTop: "1rem" }}
                        >
                          {article.images.map((img, idx) => {
                            // Create a unique key for this media item using userKey.
                            const key = `${userKey}-${idx}`;
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
                                  {mediaAnalysis[userKey] && mediaAnalysis[userKey][idx]
                                    ? mediaAnalysis[userKey][idx].analysis
                                    : "No analysis available"}
                                </div>
                                <Button
                                  variant="outlined"
                                  onClick={() => {
                                    const analysisObj = {
                                      articleTitle: article.title,
                                      source: article.source || "Unknown source",
                                      image_url: img,
                                      image_urls: article.images,
                                      analysis:
                                        mediaAnalysis[userKey] && mediaAnalysis[userKey][idx]
                                          ? mediaAnalysis[userKey][idx].analysis
                                          : "No analysis available",
                                    };
                                    if (addedMedia[key]) {
                                      // Toggle undo adding
                                      setAddedMedia((prev) => ({ ...prev, [key]: false }));
                                    } else {
                                      addMediaAnalysis(analysisObj);
                                      setAddedMedia((prev) => ({ ...prev, [key]: true }));
                                    }
                                  }}
                                  sx={{ marginLeft: 1 }}
                                >
                                  {addedMedia[key] ? "Added" : "Add to Report"}
                                </Button>
                              </div>
                            );
                          })}
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
              {video.title}{" "}
              <span className="score-text">
                (Relevance Score: {video.score.toFixed(2)})
              </span>
              {video.source && (
                <a href={video.source} target="_blank" rel="noopener noreferrer">
                  {" "}....Read more
                </a>
              )}
            </h3>
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
            <Button
              variant="contained"
              onClick={() => toggleVideoInclusion(index)}
              sx={{
                float: 'right',
                maxWidth: '45%',
                backgroundColor: videoInclusions[index] ? "#f44336" : "#4caf50",
                color: "#fff",
                marginBottom: 2
              }}
            >
              {videoInclusions[index] ? "Exclude from Report" : "Include in Report"}
            </Button>
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
        <div className="insights-document-container" style={{marginBottom: "300px"}}>
          <h3 className="insights-title">Uploaded Video Summaries</h3>
          {uploadedVideos.map((video, index) => (
            <div key={`uploaded-video-${index}`} className="insights-item" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
              <h3 className="insights-header">
                {video.title}
                {video.source && (
                  <a href={video.source} target="_blank" rel="noopener noreferrer">
                    {" "}....Read more
                  </a>
                )}
              </h3>
              <p>{video.summary}</p>
            </div>
          ))}
        </div>
      )}
      {fileInfo && (
        <div className="insights-document-container">
          <h3 className="insights-title">Document Summary</h3>
          <p>
            <span className="insights-header">File Info: </span>
            {fileInfo}
          </p>
        </div>
      )}
      <div className="insights-btn-container">
        <NextButton
          buttonText="Generate report/ppt →"
          onClick={(e) =>
            handleDocumentsGeneration(e, { articleInclusions, videoInclusions, userArticleInclusions, userVideoInclusions, uploadedVideoInclusions })
          }
        />
      </div>
    </div>
  );
}

export default DeepInsightsDisplay;