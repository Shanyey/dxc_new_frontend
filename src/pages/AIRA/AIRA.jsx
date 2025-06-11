import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// temporarily disable
// import { auth } from "../Firebase";
import DeepResearchInput from "../../components/AIRA/AIRA_InputQuery";
import DeepInsightsDisplay from "../../components/AIRA/DeepInsightsDisplay";
import DocumentsDisplay from "../../components/AIRA/DocumentsDisplay";
import TopBar from "../../components/TopBar/TopBar";

function AIRA() {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [firstQueryCheck, setFirstQueryCheck] = useState(true);
    // User inputs
    const [query, setQuery] = useState('');
    const [urls, setUrls] = useState('');
    const [top_k, setTopK] = useState(10);

    // Data for InsightsDisplay
    const [insightsData, setInsightsData] = useState({
        overview: "",
        insights: "",
        fileInfo: "",
        userArticles: [],
        bingArticles: [],
        userVideos: [],
        videos: [],
        references: [],
        videoURLs: [],
        articleURLS: [],
        mediaAnalysis: [],
        uploadedVideos: []
    });

    // Data for DocumentsDispay
    const[docs, setDocs] = useState([{}]);
    const[reportUrl, setReportUrl] = useState("")

    const handleChangeTopK = (k) => {
        setTopK(k)
    };

    const [showGuide, setShowGuide] = useState(false);
    const handleCloseGuide = () => setShowGuide(false);

    // Checks if user is authenticated
    // temporarily disable
    /*
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
        if (user) {
            setUserInfo({
            userDetails: user.displayName,
            userImage: user.photoURL,
            userMail: user.email,
            });
        } else {
            navigate("/");
        }
        });
    }, []);
    */

    const handleAddMediaAnalysis = (mediaAnalysisObj) => {
        setInsightsData((prev) => ({
          ...prev,
          rerankedArticles: prev.rerankedArticles.map((article) => {
            if (article.title === mediaAnalysisObj.articleTitle) {
              return {
                ...article,
                mediaAnalysis: article.mediaAnalysis
                  ? [...article.mediaAnalysis, mediaAnalysisObj]
                  : [mediaAnalysisObj],
              };
            }
            return article;
          }),
        }));
      };
            

    const handleNewTranscript = (transcript, title) => {
        const newVideo = {
            source: null,
            title: title,
            summary: transcript,
            score: 5.00,
            credibility_score: 5.00,
        };
        
        setInsightsData(prev => ({
            ...prev,
            uploadedVideos: [...(prev.uploadedVideos || []), newVideo],
        }));
    };

     // Function to reset Step 2 and Step 3 when submitting new query
    const resetState = () => {
        // setUrls(''); // Reset URLs for step 1
        setDocs([]); // Reset documents for step 3
        setReportUrl(""); // Clear report URL
        setInsightsData({
            overview: "",
            insights: "",
            fileInfo: "",
            // titles: [],
            // summaries: [],
            userArticles: [],
            bingArticles: [],
            userVideos: [],
            videos: [],
            references: [],
            videoURLs: [],
            articleURLS: [],
        });
    };

    async function handleInsightsGeneration(e) {
        e.preventDefault();

        // Validation: Check if query is empty
        if (!query.trim()) {
            alert("Query cannot be empty. Please enter a valid query.");
            setIsLoading(false);
            return;
        }
        const hasInsightsData = insightsData.overview

        // If there is data in insightsData, show the confirmation alert
        if (hasInsightsData) {
            const confirmReset = window.confirm(
                "Upon submitting, you will clear the previous insights data generated in step 2. Do you wish to proceed?"
            );
            if (!confirmReset) {
                setIsLoading(false);
                return;
            }
        }
        setFirstQueryCheck(false);
        setIsLoading(true)
        setStep(step + 1);
        resetState();

        try {
            const response = await fetch(`${baseUrl}/deep_insights`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query, username: userInfo.userMail, top_k, urls })
            });

            if (!response.ok) {
                console.error(`Request failed with status ${response.status}, ${response.statusText}`);
            }

            const responseData = await response.json();
            if (!responseData.success) {
                console.error("Failed to fetch data, please view error in response body:\n");
            }

            const data = responseData.data || {};
            
            setInsightsData({
                ...insightsData,
                overview: data.overview || "No overview available.",
                fileInfo: data.fileInfo || "No file info available.",
                insights: data.insights || "No insights available.",
                rerankedArticles: data.rerankedArticles || [],
                rerankedVideos: data.rerankedVideos || [],
                userArticles: data.userArticles || [],
                userVideos: data.userVideos || [],
                references: data.references || [],
                error_messages: data.error_messages || []
            });          

        } catch(error) {
            console.log("Error fetching Insights data:", error);
            alert("Failed to fetch insights data. Please try again.");
            setStep(step);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDocumentsGeneration(e, inclusions) {
        e.preventDefault();
        setIsLoading(true);
        setStep(step + 1);
    
        const { articleInclusions, videoInclusions, userArticleInclusions, userVideoInclusions, uploadedVideoInclusions } = inclusions;
        if (!articleInclusions && !videoInclusions && !userArticleInclusions && !userVideoInclusions) {
            alert("Please select at least one video or article to include in the report.");
            setIsLoading(false);
            setStep(step);
            return;
        }
    
        // Filter the included articles and videos as before
        const includedBingArticles = (insightsData?.rerankedArticles || []).filter((_, index) => articleInclusions[index]);
        const includedUserArticles = (insightsData?.userArticles || []).filter((_, index) => userArticleInclusions[index]);
        const includedVideos = (insightsData?.rerankedVideos || []).filter((_, index) => videoInclusions[index]);
        const includedUserVideos = (insightsData?.userVideos || []).filter((_, index) => userVideoInclusions[index]);
        const includedUploadedVideos = (insightsData?.uploadedVideos || []).filter((_, index) => uploadedVideoInclusions[index]); 

        console.log(`includedUserArticles in handleDocumentGen: ${includedUserArticles}`)
    
        // Process Bing articles into text outputs, now merging in media analysis
        const { bingArticles, bingUrls, bingArticleRaw } = includedBingArticles.reduce(
            (acc, article, index) => {
              const { summary, title, source, content, mediaAnalysis } = article;
              let articleText = `### Article ${index + 1}: ${title}\n#### Link: ${source}\n${summary}\n`;
              let rawArticleText = `### Article ${index + 1}: ${title}\n#### Link: ${source}\n${content}\n`;
          
              if (mediaAnalysis && mediaAnalysis.length > 0) {
                articleText += "\nMedia Analysis:\n";
                rawArticleText += "\nMedia Analysis:\n";
                mediaAnalysis.forEach((analysisItem, idx) => {
                  let analysisText = "";
                  if (typeof analysisItem === "object") {
                    // Extract the analysis text and image URL if available.
                    analysisText = analysisItem.analysis || "No analysis available";
                    // Append the analysis text and include the image URL for reference.
                    articleText += `  ${idx + 1}. ${analysisText}\n`;
                    articleText += `     Image URL: ${analysisItem.image_url}\n`;
                    rawArticleText += `  ${idx + 1}. ${analysisText}\n`;
                    rawArticleText += `     Image URL: ${analysisItem.image_url}\n`;
                  } else {
                    analysisText = analysisItem;
                    articleText += `  ${idx + 1}. ${analysisText}\n`;
                    rawArticleText += `  ${idx + 1}. ${analysisText}\n`;
                  }
                });
              }
          
              acc.bingArticles.push(articleText);
              acc.bingUrls.push(source);
              acc.bingArticleRaw.push(rawArticleText);
              setIsLoading(false);
              return acc;
            },
            { bingArticles: [], bingUrls: [], bingArticleRaw: [] }
          );          
    
        // Process user-provided articles into text outputs
        const { userArticles, userArticleUrls, userArticleRaw } = includedUserArticles.reduce(
            (acc, { summary, title, url, rawContent }, index) => {
                acc.userArticles.push(`### Article ${index + 1}: ${title}\n#### Link: ${url}\n${summary}\n`);
                acc.userArticleUrls.push(url);
                acc.userArticleRaw.push(`### Article ${index + 1}: ${title}\n#### Link: ${url}\n${rawContent}\n`);
                return acc;
            },
            { userArticles: [], userArticleUrls: [], userArticleRaw: [] }
        );
    
        // Process videos
        const { videoSummaries, videoUrls, videoMetadata } = includedVideos.reduce(
            (acc, { summary, title, source, duration, author }, index) => {
                acc.videoSummaries.push(`### Video ${index + 1}: ${title}\n#### Link: ${source}\n${summary}\n`);
                acc.videoUrls.push(source);
                acc.videoMetadata.push(`### Video ${index + 1}: ${title}\n#### Link: ${source}\n### Author: ${author}\n### Duration: ${duration}\n`);
                return acc;
            },
            { videoSummaries: [], videoUrls: [], videoMetadata: [] }
        );
        const { userVideoSummaries, userVideoUrls, userVideoMetadata } = includedUserVideos.reduce(
            (acc, { summary, title, url, duration, author }, index) => {
                acc.userVideoSummaries.push(`### Video ${index + 1}: ${title}\n#### Link: ${url}\n${summary}\n`);
                acc.userVideoUrls.push(url);
                acc.userVideoMetadata.push(`### Video ${index + 1}: ${title}\n#### Link: ${url}\n### Author: ${author}\n### Duration: ${duration}\n`);
                return acc;
            },
            { userVideoSummaries: [], userVideoUrls: [], userVideoMetadata: [] }
        );
        const { uploadedVideoSummaries, uploadedVideoMetadata } = includedUploadedVideos.reduce(
            (acc, { summary, title }, index) => {
                acc.uploadedVideoSummaries.push(`### Video ${index + 1}: ${title}\n### Summary: ${summary}\n`);
                acc.uploadedVideoMetadata.push(`### Video ${index + 1}: ${title}\n### Source: Uploaded Video File\n`);
                return acc;
            },
            { uploadedVideoSummaries: [], uploadedVideoMetadata: [] }
        );
    
        // Main content for report
        const overview = insightsData.overview;
        const insights = insightsData.insights;
    
        // Check if arrays are empty and set "N/A" if they are
        const bingArticlesText = bingArticles.length > 0 ? bingArticles.join("\n") : "N/A";
        const userArticlesText = userArticles.length > 0 ? userArticles.join("\n") : "N/A";
        const videoSummariesText = videoSummaries.length > 0 ? videoSummaries.join("\n") : "N/A";
        const userVideoSummariesText = userVideoSummaries.length > 0 ? userVideoSummaries.join("\n") : "N/A";
        const uploadedVideoSummariesText = uploadedVideoSummaries.length > 0 ? uploadedVideoSummaries.join("\n") : "N/A";
    
        // Combine the summaries
        const combinedArticleSummaries = `### Relevant Articles:\n${bingArticlesText}\n\n### User Provided Articles:\n${userArticlesText}`;
        const combinedVideoSummaries = `### Relevant Videos:\n${videoSummariesText}\n\n### User Provided Videos:\n${userVideoSummariesText}\n\n### User Uploaded Video Files:\n${uploadedVideoSummariesText}`;
    
        const contextBody = `## Overview:\n${overview}\n\n` +
                            `## Insights:\n${insights}\n\n` +
                            `## Article Summaries:\n${combinedArticleSummaries}\n\n` +
                            `## Video Summaries:\n${combinedVideoSummaries}\n\n`;
    
        // Check if each array is empty and set "N/A" if it is
        const bingUrlsText = bingUrls.length > 0 ? bingUrls.join("\n") : "N/A";
        const userArticleUrlsText = userArticleUrls.length > 0 ? userArticleUrls.join("\n") : "N/A";
        const videoUrlsText = videoUrls.length > 0 ? videoUrls.join("\n") : "N/A";
        const userVideoUrlsText = userVideoUrls.length > 0 ? userVideoUrls.join("\n") : "N/A";
    
        const bingArticleRawText = bingArticleRaw.length > 0 ? bingArticleRaw.join("\n") : "N/A";
        const userArticleRawText = userArticleRaw.length > 0 ? userArticleRaw.join("\n") : "N/A";
        const videoMetadataText = videoMetadata.length > 0 ? videoMetadata.join("\n") : "N/A";
        const userVideoMetadataText = userVideoMetadata.length > 0 ? userVideoMetadata.join("\n") : "N/A";
        const uploadedVideoMetadataText = uploadedVideoMetadata.length > 0 ? uploadedVideoMetadata.join("\n") : "N/A";
    
        // References section
        const referencesBody = `### Relevant Articles:\n${bingUrlsText}\n\n### User Provided Articles:\n${userArticleUrlsText}\n\n### Relevant Videos:\n${videoUrlsText}\n\n### User Provided Videos:\n${userVideoUrlsText}`;
    
        // Appendix B: Raw, scraped/cleansed content
        const rawCombinedArticles = `### Relevant Articles:\n\n${bingArticleRawText}\n\n### User Provided Articles:\n${userArticleRawText}`;
        const rawCombinedVideos = `### Relevant Videos:\n\n${videoMetadataText}\n\n### User Provided Videos:\n${userVideoMetadataText}\n\n### User Uploaded Video Files:\n${uploadedVideoMetadataText}`;
        const rawBody = `${rawCombinedArticles}\n\n${rawCombinedVideos}`;
    
        try {
            const context = contextBody;
            const reference = referencesBody;
            const rawContent = rawBody;
            
            // Notice that we are no longer sending mediaAnalysis separately
            const reportPromise = fetch(`${baseUrl}/deep/report`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query, context, reference, rawContent })
            });
    
            const pptPromise = fetch(`${baseUrl}/powerpoint`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query, context })
            });
    
            const [reportResponse, pptResponse] = await Promise.all([reportPromise, pptPromise]);
    
            if (!reportResponse.ok || !pptResponse.ok) {
                throw new Error(`Failed to fetch data: ${reportResponse.statusText} / ${pptResponse.statusText}`);
            }
    
            const fileBlob = await reportResponse.blob();
            const fileUrl = URL.createObjectURL(fileBlob);
    
            // Download ppt file
            const pptBlob = await pptResponse.blob();
            const pptUrl = URL.createObjectURL(pptBlob);
            const a = document.createElement('a');
            a.href = pptUrl;
            a.download = 'presentation.pptx';
            document.body.appendChild(a);
            a.click();
            a.remove();
    
            setDocs([{ uri: fileUrl, fileName: "report.pdf" }]);
            setReportUrl(fileUrl);
            setIsLoading(false);
    
        } catch(error) {
            console.error("Error fetching the file:", error);
            setIsLoading(false);
            alert("Failed to generate report. Please try again.");
            setStep(step);
        }
    }    

    function renderComponent() {
        switch (step) {
            case 1:
                return (
                    <DeepResearchInput
                        query={query}
                        setQuery={setQuery}
                        urls={urls}
                        setUrls={setUrls}
                        onSubmit={handleInsightsGeneration}
                        userInfo={userInfo}
                        onTranscriptAdd={handleNewTranscript}
                        top_k={top_k}
                        handleChangeTopK={handleChangeTopK}
                    />
                );
            case 2:
                return (
                    <>
                    <DeepInsightsDisplay
                        {...insightsData}
                        query={query}
                        handleDocumentsGeneration={handleDocumentsGeneration}
                        addMediaAnalysis={handleAddMediaAnalysis}
                    />
                    </>
                );
            case 3:
                return (
                    <DocumentsDisplay
                        reportUrl={reportUrl}
                    />
                );
            default:
                return (
                    <DeepResearchInput
                        query={query}
                        setQuery={setQuery}
                        urls={urls}
                        setUrls={setUrls}
                        onSubmit={handleInsightsGeneration}
                        userInfo={userInfo}
                        onTranscriptAdd={handleNewTranscript}
                        top_k={top_k}
                        handleChangeTopK={handleChangeTopK}
                    />
                );
        }
    }

    return (
        <>
            <div className="page">
                <TopBar />
             <div className="container-fluid p-4">
                <h1 className="title">AI Research Assistant (AIRA)</h1>
                </div>
                { isLoading ? (
                        <div className="loading-container">
                            hehe
                        </div>
                    ) : (
                        renderComponent()
                    )
                }
            </div>
        </>
    );
}

export default AIRA;
