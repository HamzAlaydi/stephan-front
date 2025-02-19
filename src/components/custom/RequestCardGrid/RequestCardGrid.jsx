import React from "react";
import { Grid, Typography } from "@mui/material";
import RequestCard from "../RequestCard/RequestCard";
import { Box } from "@mui/system";
import InboxIcon from "@mui/icons-material/Inbox";

const RequestCardGrid = ({ onCardClick, currentPage, requests }) => {
  return (
    <>
      {requests.length > 0 ? (
        <Grid container spacing={2}>
          {requests.map((request, index) => (
            <Grid item xs={12} key={index}>
              <RequestCard
                request={request}
                onClick={() => onCardClick(request._id)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <InboxIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No requests found
          </Typography>
        </Box>
      )}
    </>
  );
};

export default RequestCardGrid;
