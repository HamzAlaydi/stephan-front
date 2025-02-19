// src/pages/Summaries/Summaries.jsx
import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Top from "../../components/layout/Top/Top";
import CustomPagination from "../../components/custom/CustomPagination/CustomPagination";
import RequestCardGrid from "../../components/custom/RequestCardGrid/RequestCardGrid";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMaintenanceRequests,
  fetchSingleRequest,
} from "../../redux/slices/maintenanceRequestsSlice";
import MaintenanceSummaryPopup from "../../components/MaintenanceSummaryPopup/MaintenanceSummaryPopup"; // Import the new component

const Summaries = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openDetailsPopup, setOpenDetailsPopup] = useState(false);
  const dispatch = useDispatch();
  const { requests, selectedRequest, pagination, status } = useSelector(
    (state) => state.maintenanceRequests
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(
      fetchMaintenanceRequests({
        page: currentPage,
        limit: 6,
        filters: { status: "Closed" },
        user,
      })
    );
  }, [currentPage, dispatch]);

  // Filter and sort closed requests
  const closedRequests = requests
    .filter((request) => request.requestStatus === "Closed")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  const handleCardClick = (requestId) => {
    dispatch(fetchSingleRequest(requestId));
    setOpenDetailsPopup(true);
  };

  const handleDetailsPopupClose = () => {
    setOpenDetailsPopup(false);
  };

  // Map selectedRequest to maintenanceData
  const maintenanceData = selectedRequest
    ? {
        id: selectedRequest.requestID,
        date: new Date(selectedRequest.createdAt).toLocaleDateString(),
        time: `${new Date(
          selectedRequest.createdAt
        ).toLocaleTimeString()} to ${new Date(
          selectedRequest.updatedAt
        ).toLocaleTimeString()}`,
        productionLine: selectedRequest.productionLine?.name || "N/A",
        machineName: selectedRequest.machine?.name || "N/A",
        machineId: selectedRequest.machine?.machineId || "N/A",
        // Fix: Ensure sparePartsUsed is properly mapped and has the correct structure
        sparePartsUsed: Array.isArray(selectedRequest.sparePartsUsed)
          ? selectedRequest.sparePartsUsed.map((part) => ({
              category: part.category || part.partCategory || "N/A",
              partName: part.name || part.partName || "N/A",
              quantity: part.quantity || 0,
              price: parseFloat(part.price || 0),
            }))
          : [],
        machineStatus: selectedRequest.machineStatus || "N/A",
        productionLineDownStart:
          selectedRequest.productionLineDownStart || "N/A",
        productionLineDownEnd: selectedRequest.productionLineDownEnd || "N/A",
        machineDownStart: selectedRequest.machineDownStart || "N/A",
        machineDownEnd: selectedRequest.machineDownEnd || "N/A",
        breakDownCauses: selectedRequest.breakDownCauses || "N/A",
        solution: selectedRequest.solution || "N/A",
        recommendations: selectedRequest.recommendations || "N/A",
        attachments: selectedRequest.attachments || [],
        assignedTo: selectedRequest.assignedTo || "N/A",
        assignedBy: selectedRequest.assignedBy || "N/A",
        createdBy: selectedRequest.createdBy || "N/A",
        failures: selectedRequest.failures || "N/A",
      }
    : null;

  return (
    <Box sx={{ flexGrow: 1 }} className="normal-page-style">
      <Top title={"Closed Requests Summary"} />
      <RequestCardGrid
        requests={closedRequests}
        onCardClick={handleCardClick}
        currentPage={currentPage}
      />
      <Box>
        <CustomPagination
          totalItems={closedRequests.length}
          itemsPerPage={6}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={pagination.totalPages}
        />
      </Box>
      <MaintenanceSummaryPopup
        open={openDetailsPopup}
        onClose={handleDetailsPopupClose}
        maintenanceData={maintenanceData}
      />
    </Box>
  );
};

export default Summaries;
