// src/pages/TechnicianRequests/TechnicianRequests.jsx
import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Top from "../../components/layout/Top/Top";
import RequestCardGrid from "../../components/custom/RequestCardGrid/RequestCardGrid";
import TechnicianRequestPopup from "../../components/TechnicianRequestPopup/TechnicianRequestPopup";
import { useDispatch, useSelector } from "react-redux";
import { fetchMaintenanceRequests } from "../../redux/slices/maintenanceRequestsSlice";
import CustomPagination from "../../components/custom/CustomPagination/CustomPagination";

const TechnicianRequests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openDetailsPopup, setOpenDetailsPopup] = useState(false);
  const [openCreateRequestPopup, setOpenCreateRequestPopup] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const dispatch = useDispatch();
  const { requests } = useSelector((state) => state.maintenanceRequests);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(
      fetchMaintenanceRequests({
        page: currentPage,
        limit: 6,
        filters: {
          assignedTo: user._id,
          status: { $ne: "Closed" },
        },
      })
    );
  }, [currentPage, dispatch, user]);

  // Filter requests assigned to the current technician
  const technicianRequests = requests.filter(
    (req) => req.assignedTo === user?._id && req.requestStatus !== "Closed"
  );
  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="normal-page-style">
      <Top title={"Assigned Requests"} />
      <RequestCardGrid
        currentPage={currentPage}
        requests={technicianRequests}
        onCardClick={(requestId) => {
          const request = requests.find((r) => r._id === requestId);
          setSelectedRequest(request);
        }}
      />

      {selectedRequest && (
        <TechnicianRequestPopup
          open={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          request={selectedRequest}
        />
      )}

      <Box>
        <CustomPagination
          totalItems={technicianRequests.length}
          itemsPerPage={6}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </Box>
    </Box>
  );
};

export default TechnicianRequests;
