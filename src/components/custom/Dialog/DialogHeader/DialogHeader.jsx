import { DialogTitle, Grid, Typography, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const styles = {
  key: {
    fontFamily: "Nunito Sans",
    fontSize: "16px",
    fontWeight: 300,
    lineHeight: "21.82px",
    textAlign: "left",
  },
  value: {
    fontFamily: "Nunito Sans",
    fontSize: "15px",
    fontWeight: 300,
    lineHeight: "20.46px",
    textAlign: "left",
    textUnderlinePosition: "from-font",
    textDecorationSkipInk: "none",
  },
  pageTitle: {
    fontSize: "24px",
    fontWeight: "700",
    textAlign: "left",
    color: "#1e1e1e",
  },
};
export const DialogHeader = ({ request, onClose, title, addIcon = false }) => (
  <DialogTitle style={{ marginBottom: "20px" }}>
    <Grid container alignItems="center">
      <Grid item xs={8}>
        <Typography style={styles.pageTitle} variant="h6">
          {title}
        </Typography>
      </Grid>

      <Grid item xs={4}>
        <Box display="flex" alignItems="center" justifyContent="flex-end">
          {addIcon && (
            <Box
              display="flex"
              alignItems="center"
              sx={{
                width: "77px",
                height: "28px",
                border: "1px solid #16423C80",
                borderRadius: "5px 0px 0px 0px",
                padding: "0 4px",
                boxSizing: "border-box",
                backgroundColor: "transparent",
              }}
            >
              <AccessTimeIcon
                sx={{
                  width: "15px",
                  height: "15px",
                  color: "#16423C",
                  marginRight: "4px",
                }}
              />
              <Typography sx={styles.value}>{request?.status}</Typography>
            </Box>
          )}

          <IconButton
            onClick={onClose}
            sx={{
              width: "31px",
              height: "31px",
              padding: 0,
              marginLeft: 1,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Grid>
    </Grid>
  </DialogTitle>
);
