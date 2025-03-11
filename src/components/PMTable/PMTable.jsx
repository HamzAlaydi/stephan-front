import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Grid,
  TextField,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
import CustomPagination from "../custom/CustomPagination/CustomPagination";
import filterIcon from "../../assets/icons/filterIcon.png";
import "./PMTable.css";

const PMTable = ({
  data = [],
  columns = [],
  dataKey = "id",
  filterFunction,
  onRowClick,
  pagination = true,
  itemsPerPage = 5,
  tableName = "", // New prop for table name
  showFilter = true, // New prop to control visibility of the filter box
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [filter, setFilter] = useState("");

  // Check screen size
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Filter the data based on the input value
  const filteredData = filter
    ? data.filter((row) =>
        filterFunction
          ? filterFunction(row, filter)
          : defaultFilter(row, filter)
      )
    : data;

  // Calculate the total number of pages based on filtered data
  const totalItems = filteredData.length;
  const [totalPages, setTotalPages] = useState(1);
  const currentPageAdjusted = Math.min(currentPage, totalPages || 1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = pagination
    ? filteredData.slice(startIndex, endIndex)
    : filteredData;

  // Handle page change
  const handlePageChange = (event, page) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
  };

  // Handle filter input change
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1); // Reset to the first page when filtering
  };

  // Default filter function
  const defaultFilter = (row, filter) => {
    return Object.values(row).some((value) =>
      String(value).toLowerCase().includes(filter.toLowerCase())
    );
  };

  useEffect(() => {
    const total = Math.ceil(filteredData.length / itemsPerPage);
    setTotalPages(total || 1);
    // Reset to first page if current page exceeds new total pages
    if (currentPage > total) {
      setCurrentPage(1);
    }
  }, [filteredData, itemsPerPage]);
  return (
    <>
      {/* Title and Search Field */}
      <Box className="title-container">
        <Grid container alignItems="center" justifyContent="space-between">
          {/* Table Name */}
          <Grid item xs={12} sm={6}>
            {tableName && <p className="table-name">{tableName}</p>}
          </Grid>

          {/* Filter Box (Conditional Rendering) */}
          {showFilter && (
            <Grid item xs={12} sm={6} md={4}>
              <Box className="filter-container">
                <img
                  src={filterIcon}
                  alt="Filter Icon"
                  className="filter-icon"
                />
                <TextField
                  placeholder="Filter"
                  variant="standard"
                  value={filter}
                  onChange={handleFilterChange}
                  fullWidth
                  InputProps={{
                    className: "filter-input",
                    disableUnderline: true,
                  }}
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Table */}
      <Box className="table-wrapper">
        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow className="table-head-row">
                {columns.map((column) => {
                  // Hide less important columns on small screens
                  if (isSmallScreen && column.hideOnSmall) return null;
                  return (
                    <TableCell
                      key={column.key}
                      className={`table-head ${
                        column.key === "id" ? "id-cell" : ""
                      } ${
                        column.key === "description" ? "left-align" : "" // Add left-align class for description
                      }`}
                    >
                      {column.label}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow
                  key={row[dataKey]}
                  className="table-data-row"
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => {
                    // Hide less important columns on small screens
                    if (isSmallScreen && column.hideOnSmall) return null;

                    return (
                      <TableCell
                        key={column.key}
                        className={`table-data ${
                          column.key === "id" ? "id-cell" : ""
                        } ${
                          column.key === "description" ? "left-align" : "" // Add left-align class for description
                        }`}
                      >
                        {column.render ? column.render(row) : row[column.key]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Pagination */}
      {pagination && (
        <Box className="pagination-container">
          <CustomPagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalPages={totalPages} // Add this line if your component supports it
            onPageChange={handlePageChange}
          />
        </Box>
      )}
    </>
  );
};

export default PMTable;
