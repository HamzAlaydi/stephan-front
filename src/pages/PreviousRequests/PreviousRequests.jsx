import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Top from "../../components/layout/Top/Top";
import CustomPagination from "../../components/custom/CustomPagination/CustomPagination";
import RequestPopup from "../../components/RequestPopup/RequestPopup";
import RequestCardGrid from "../../components/custom/RequestCardGrid/RequestCardGrid";
import "./PreviousRequests.css";
import CreateRequestPopup from "../../components/CreateRequestPopup/CreateRequestPopup";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMaintenanceRequests,
  fetchSingleRequest,
} from "../../redux/slices/maintenanceRequestsSlice";

const PreviousRequests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openDetailsPopup, setOpenDetailsPopup] = useState(false);
  const [openCreateRequestPopup, setOpenCreateRequestPopup] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isSupervisor = user?.department?.name === "maintenance supervisor";
  const isTechnician = user?.department?.name === "maintenance technical";
  const { requests, pagination, selectedRequest, status } = useSelector(
    (state) => state.maintenanceRequests
  );

  useEffect(() => {
    const filters = {};
    if (isTechnician) {
      filters.assignedTo = user._id;
      filters.status = { $ne: "Closed" };
    } else if (!isSupervisor) {
      filters.status = { $ne: "Closed" };
    } else if (isSupervisor) {
      filters.status = { $ne: "Closed" };
    }

    dispatch(
      fetchMaintenanceRequests({
        page: currentPage,
        limit: 6,
        filters,
        user,
      })
    );
  }, [currentPage, dispatch, isSupervisor, isTechnician, user]);

  const filteredRequests = requests.filter((request) => {
    if (isTechnician) {
      return (
        request.assignedTo === user._id && request.requestStatus !== "Closed"
      );
    }
    return !isSupervisor || request.requestStatus !== "Closed";
  });
  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  const handleCardClick = (requestId) => {
    dispatch(fetchSingleRequest(requestId)); // Fetch details for the selected request
    setOpenDetailsPopup(true);
  };

  const handleDetailsPopupClose = () => {
    setOpenDetailsPopup(false);
  };

  const handleCreateRequestPopupClose = () => {
    setOpenCreateRequestPopup(false);
  };

  const handleCreateRequestPopupOpen = () => {
    setOpenCreateRequestPopup(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="normal-page-style">
      <Top
        title={isTechnician ? "Assigned Requests" : "Previous Requests"}
        btnName={!isSupervisor && !isTechnician ? "Create Request" : null}
        onButtonClick={handleCreateRequestPopupOpen}
      />
      <RequestCardGrid
        requests={requests} // Use the directly fetched requests
        onCardClick={handleCardClick}
      />
      <Box>
        <CustomPagination
          totalPages={pagination.totalPages}
          currentPage={pagination.currentPage}
          onPageChange={handlePageChange}
        />
      </Box>
      <RequestPopup
        open={openDetailsPopup}
        onClose={handleDetailsPopupClose}
        selectedCard={selectedRequest} // Pass selected request as a prop
        isTechnicianView={isTechnician}
      />
      <CreateRequestPopup
        open={openCreateRequestPopup}
        onClose={handleCreateRequestPopupClose}
        addIcon={false}
      />
    </Box>
  );
};

export default PreviousRequests;
