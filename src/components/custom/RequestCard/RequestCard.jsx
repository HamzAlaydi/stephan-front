import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import "./RequestCard.css"; // Import the external CSS file

const RequestCard = ({ request, onClick, isSelected }) => {
  // Format the date as "Jan 12, 2025"
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <Card
      variant="outlined"
      className="request-card"
      onClick={() => onClick(request)}
      sx={{
        width: "250px",
        boxShadow: isSelected ? "0 0 20px rgba(0, 0, 0, 0.3)" : "none",
      }}
    >
      <CardContent>
        <Typography variant="h6" className="request-id">
          ID: {request.requestID}
        </Typography>

        <Typography variant="body1" className="request-status">
          {request.requestStatus}
        </Typography>

        <Typography variant="body2" className="request-date">
          {formatDate(request.createdAt)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RequestCard;
