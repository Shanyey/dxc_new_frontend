import React from "react";
//import { Card, CardContent, CardMedia, Typography, Accordion, AccordionSummary, AccordionDetails, Button } from "@mui/material";
//import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./YouTubeVideoCard.css";

// Function to embed YouTube video by ID
function YouTubeEmbed({ videoId }) {
  return (
    <CardMedia
      component="iframe"
      height="200"
      width="300" // Adjusted width for horizontal alignment
      src={`https://www.youtube.com/embed/${videoId}`}
      allowFullScreen
      title="YouTube Video"
    />
  );
}

const YouTubeVideoCard = ({ videoId, title, author, duration, published, summary, transcription, isIncluded, toggleInclusion }) => {
  return (
    <Accordion sx={{ marginBottom: "20px", boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)", borderRadius: "5px" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Card sx={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'flex-start' }}>
          {/* Embed the YouTube video */}
          <YouTubeEmbed videoId={videoId} />

          {/* Card Content beside the video */}
          <CardContent sx={{ paddingLeft: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {author} • {duration}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
              Video Summary: {summary}
            </Typography>

            {/* Include/Exclude Button */}
            <Button
              variant="contained"
              onClick={toggleInclusion}  // Call the parent toggle function
              sx={{
                float: 'right',
                width: '50%',
                backgroundColor: isIncluded ?  "#f44336" : "#4caf50",
                color: "#fff",
                marginBottom: 2
              }}
            >
              {isIncluded ? "Exclude from Report" : "Include in Report"}
            </Button>

            {/* Expandable Transcription */}
            <Accordion className="accordion-card" sx={{width: '100%'}}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>View Transcription</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {transcription}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      </AccordionDetails>
    </Accordion>
  );
};

export default YouTubeVideoCard;
