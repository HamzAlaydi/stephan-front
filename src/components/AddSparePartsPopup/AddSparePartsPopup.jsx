import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Grid,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { DialogHeader } from "../custom/Dialog/DialogHeader/DialogHeader";
import { useDispatch } from "react-redux";
import { addSpareParts } from "../../redux/slices/maintenanceRequestsSlice";
import AddIcon from "@mui/icons-material/Add";
import "./AddSparePartsPopup.css";

const AddSparePartsPopup = ({ open, onClose, requestId }) => {
  const dispatch = useDispatch();
  const [parts, setParts] = useState([
    { category: "", partName: "", quantity: 1, price: 0 },
  ]);
  const [solution, setSolution] = useState("");
  const [recommendations, setRecommendations] = useState("");

  const handleAddPart = () => {
    setParts([...parts, { category: "", partName: "", quantity: 1, price: 0 }]);
  };

  const handleSubmit = () => {
    dispatch(
      addSpareParts({
        requestId,
        spareParts: parts,
        solution,
        recommendations,
      })
    ).then(() => {
      window.location.reload(); // Refresh the page after the API call is completed
    });

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className="spare-parts-dialog"
    >
      <DialogHeader onClose={onClose} title="Add Spare Parts" />
      <DialogContent className="dialog-content">
        <Grid container spacing={3}>
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" className="section-label">
                  Spare Part {index + 1}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography className="input-label">Category</Typography>
                <TextField
                  placeholder="Enter Category"
                  fullWidth
                  size="small"
                  value={part.category}
                  className="textField"
                  onChange={(e) => {
                    const newParts = [...parts];
                    newParts[index].category = e.target.value;
                    setParts(newParts);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography className="input-label">Part Name</Typography>
                <TextField
                  placeholder="Enter Part Name"
                  size="small"
                  fullWidth
                  value={part.partName}
                  className="textField"
                  onChange={(e) => {
                    const newParts = [...parts];
                    newParts[index].partName = e.target.value;
                    setParts(newParts);
                  }}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <Typography className="input-label">Quantity</Typography>
                <TextField
                  placeholder="Enter Quantity"
                  size="small"
                  type="number"
                  fullWidth
                  value={part.quantity}
                  className="textField"
                  onChange={(e) => {
                    const newParts = [...parts];
                    newParts[index].quantity = e.target.value;
                    setParts(newParts);
                  }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography className="input-label">Price</Typography>
                <TextField
                  placeholder="Enter Price"
                  size="small"
                  type="number"
                  fullWidth
                  value={part.price}
                  className="textField"
                  onChange={(e) => {
                    const newParts = [...parts];
                    newParts[index].price = e.target.value;
                    setParts(newParts);
                  }}
                />
              </Grid>
            </React.Fragment>
          ))}

          <Grid item xs={12}>
            <Button
              variant="outlined"
              onClick={handleAddPart}
              className="add-part-button"
              startIcon={<AddIcon />}
            >
              Add More Parts
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Typography className="input-label">
              Solution Implemented
            </Typography>
            <TextField
              placeholder="Enter Solution Implemented"
              size="small"
              fullWidth
              multiline
              rows={1}
              value={solution}
              className="textField"
              onChange={(e) => setSolution(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography className="input-label">Recommendations</Typography>
            <TextField
              placeholder="Enter Recommendations"
              size="small"
              fullWidth
              multiline
              rows={1}
              value={recommendations}
              className="textField"
              onChange={(e) => setRecommendations(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} container justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleSubmit}
              className="submit-button"
            >
              Submit Report
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default AddSparePartsPopup;
