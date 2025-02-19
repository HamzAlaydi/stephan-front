import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/material";
// export const columns = [
//   { key: "productionId", label: "ID" },
//   { key: "name", label: "Machine Name" },
//   { key: "description", label: "Description" },
// ];

// src/mockData/data.js
export const columns = [
  { key: "productionId", label: "Production Line ID" },
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
];

export const ProductionLineColumns = [
  { key: "ID", label: "ID", width: "15%" },
  { key: "machineName", label: "Machine Name", width: "25%" },
  {
    key: "totalMaintenanceCost",
    label: "Maintenance Cost",
    width: "20%",
    render: (row) => `Total Cost (CA) ${row.totalMaintenanceCost}$`,
  },
  {
    key: "actions",
    label: "Actions",
    width: "10%",
    render: (row) => (
      <>
        <EditIcon
          style={{ cursor: "pointer", color: "#1976d2", marginRight: "8px" }}
          onClick={() => console.log("Edit clicked for:", row.machineId)}
        />
        <DeleteIcon
          style={{ cursor: "pointer", color: "#d32f2f" }}
          onClick={() => console.log("Delete clicked for:", row.machineId)}
        />
      </>
    ),
  },
];

export const productionData = [
  {
    id: "01",
    name: "Blender Machine",
    description: "Mixes dry and liquid ingredients efficiently...",
  },
  {
    id: "02",
    name: "Labeling Machine",
    description: "Applies product labels with precision...",
  },
  {
    id: "03",
    name: "Packaging Machine",
    description: "Packs small-sized products quickly...",
  },
  {
    id: "04",
    name: "Freezing Tunnel",
    description: "Freezes products quickly and evenly...",
  },
  {
    id: "05",
    name: "Mixing Machine",
    description: "Mixes ingredients thoroughly...",
  },
  {
    id: "06",
    name: "Sealing Machine",
    description: "Seals packages securely...",
  },
  {
    id: "07",
    name: "Heating Tunnel",
    description: "Heats products evenly...",
  },
  {
    id: "08",
    name: "Cooling Tunnel",
    description: "Cools products quickly...",
  },
  {
    id: "09",
    name: "Cutting Machine",
    description: "Cuts materials precisely...",
  },
  {
    id: "10",
    name: "Filling Machine",
    description: "Fills containers accurately...",
  },
];

export const productionLineProfileData = [
  {
    ID: "M001",
    machineName: "Blender Machine",
    totalMaintenanceCost: 1200,
    productionLineId: "01",
    productionLineName: "Production Line 1",
    sparePartsCost: "$1200",
  },
  {
    ID: "M002",
    machineName: "Labeling Machine",
    totalMaintenanceCost: 800,
    productionLineId: "01",
    productionLineName: "Production Line 1",
    sparePartsCost: "$800",
  },
];

export const maintenanceData = [
  { id: "001", technicalName: "Technician A", sparePartsCost: "$120" },
  { id: "002", technicalName: "Technician B", sparePartsCost: "$180" },
  { id: "003", technicalName: "Technician C", sparePartsCost: "$200" },
];

export const maintenanceColumns = [
  { key: "id", label: "ID" },
  { key: "technicalName", label: "Technical Name" },
  { key: "sparePartsCost", label: "Spare Parts Cost" },
  {
    key: "actions",
    label: "Actions",
    render: (row) => (
      <Box
        sx={{
          width: { xs: "90px", sm: "120px" },
          height: { xs: "28px", sm: "33px" },
          borderRadius: "4px",
          backgroundColor: "rgba(22, 66, 60, 1)",
          fontSize: { xs: "10px", sm: "16px" },
          fontWeight: 400,
          lineHeight: "21.82px",
          textAlign: "center",
          color: "rgba(255, 255, 255, 1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: { xs: "4px 8px", sm: "6px 12px" },
        }}
        onClick={() => console.log("View Details clicked for:", row.id)} // Add onClick handler
      >
        View Details
      </Box>
    ),
  },
];
export default productionData;
