import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Top from "../../components/layout/Top/Top";
import PMTable from "../../components/PMTable/PMTable";
import stockItemIcon from "../../assets/icons/stockItemIcon.png";
import ImportDataPopup from "../../components/ImportDataPopup/ImportDataPopup";
import "./Stock.css";

// Mock Data for Spare Parts
const sparePartsData = [
  {
    id: "SP001",
    name: "Motor Belt",
    category: "Hardware",
    quantity: 500,
    price: "$0.50",
  },
  {
    id: "SP002",
    name: "Hydraulic Pump",
    category: "Hardware",
    quantity: 800,
    price: "$0.30",
  },
  {
    id: "SP003",
    name: "Gearbox",
    category: "Mechanical",
    quantity: 150,
    price: "$5.00",
  },
];

// Column Definitions for Spare Parts Table
const sparePartsColumns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Spare Part Name" },
  { key: "category", label: "Category" },
  { key: "quantity", label: "Quantity" },
  { key: "price", label: "Price" },
];

const Stock = () => {
  const [data, setData] = useState(sparePartsData);
  const [importPopupOpen, setImportPopupOpen] = useState(false);

  const handleImportClick = () => {
    setImportPopupOpen(true);
  };

  const handleImportClose = () => {
    setImportPopupOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="normal-page-style">
      {/* Top Section with Title and Import Data Button */}
      <Box className="maintenance-history-container">
        <Typography variant="h6" className="maintenance-history-title">
          Stock Management
        </Typography>
      </Box>
      <Top
        title="Spare Parts"
        btnName="Import Data"
        onButtonClick={handleImportClick}
      />

      {/* PMTable for Spare Parts */}
      <PMTable
        data={data}
        columns={sparePartsColumns.map((col) =>
          col.key === "price"
            ? {
                ...col,
                render: (row) => <Box className="price-cell">{row.price}</Box>,
              }
            : col.key === "name"
            ? {
                ...col,
                render: (row) => (
                  <Box className="stock-item-name">
                    <img
                      className="stock-item-cell"
                      src={stockItemIcon}
                      alt="stockItemIcon"
                    />
                    {row.name}
                  </Box>
                ),
              }
            : col
        )}
        dataKey="id"
        pagination={true}
        itemsPerPage={5}
        showFilter={true}
        filterFunction={(row, filter) => {
          return Object.values(row).some((value) =>
            String(value).toLowerCase().includes(filter.toLowerCase())
          );
        }}
      />

      {/* Import Data Popup */}
      <ImportDataPopup open={importPopupOpen} onClose={handleImportClose} />
    </Box>
  );
};

export default Stock;
