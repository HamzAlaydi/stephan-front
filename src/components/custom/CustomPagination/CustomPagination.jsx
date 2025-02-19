import React from "react";
import { Box, Pagination } from "@mui/material";

const CustomPagination = ({
  totalItems,
  itemsPerPage,
  onPageChange,
  totalPages,
  currentPage,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      className="pagination-container"
      sx={{
        maxWidth: "calc(100% - 32px)", // Adjust for padding if needed
      }}
    >
      <Pagination
        siblingCount={0}
        count={totalPages}
        page={currentPage}
        onChange={onPageChange}
        shape="square"
        sx={{
          "& .MuiPaginationItem-root": {
            color: "#000", // Text color for pagination items
            borderRadius: "4px", // Square shape
            margin: "0px 2px 0 10px", // Spacing between pagination items
            minWidth: "32px", // Fixed width for pagination items
            height: "32px", // Fixed height for pagination items
            backgroundColor: "transparent", // No background color for unselected items
            "&.Mui-selected": {
              color: "#FFF",
              backgroundColor: "#16423C", // Green background for the selected page
              "&:hover": {
                backgroundColor: "darkgreen", // Darker green on hover for the selected page
              },
            },
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.1)", // Light hover effect for unselected items
            },
          },
        }}
      />
    </Box>
  );
};

export default CustomPagination;
