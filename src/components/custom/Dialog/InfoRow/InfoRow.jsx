import { colors, Grid, Typography } from "@mui/material";

const styles = {
  key: {
    fontSize: "16px",
    fontWeight: "300",
    lineHeight: "21.82px",
    textAlign: "left",
    color: "#000",
  },
  value: {
    fontSize: "15px",
    fontWeight: 300,
    lineHeight: "20.46px",
    textAlign: "left",
    textUnderlinePosition: "from-font",
    textDecorationSkipInk: "none",
    // color black 40%
    color: colors.grey[500],
  },
};

export const InfoRow = ({ label, value, xs = 4, inline = false }) => (
  <Grid item xs={xs}>
    <Grid
      container
      direction={inline ? "row" : "column"}
      alignItems={inline ? "center" : "flex-start"}
    >
      <Typography variant="body1" sx={styles.key}>
        <p>{label}</p>
      </Typography>
      {inline && (
        <Typography variant="body1" sx={{ ...styles.value, marginLeft: "4px" }}>
          {value}
        </Typography>
      )}
      {!inline && (
        <Typography variant="body1" sx={styles.value}>
          {value}
        </Typography>
      )}
    </Grid>
  </Grid>
);
