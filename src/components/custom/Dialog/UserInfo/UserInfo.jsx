import { Grid, Typography, Avatar, Box } from "@mui/material";
import { S3 } from "../../../../Root.route";

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  avatar: {
    width: 40,
    height: 40,
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
  },
  name: {
    fontFamily: "Nunito Sans",
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "1.2",
  },
  email: {
    fontFamily: "Nunito Sans",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "1.2",
    color: "#757575",
  },
  userSection: {
    // Common style for all user sections
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginTop: "8px", // Consistent spacing between sections
  },
  userInfoSection: {
    // Common style for all user sections
    display: "flex",
    flexDirection: "column",
  },
  userName: {
    // Common style for all user names
    fontFamily: "Nunito Sans",
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "1.2",
  },
  userEmail: {
    // Common style for all user emails
    fontFamily: "Nunito Sans",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "1.2",
    color: "#757575",
  },
};

export const UserInfo = ({ request }) => {

  if (!request) {
    // Simplified null check
    return null;
  }

  return (
    <Grid container spacing={2}>
 {/* Use Grid container */}
      {request.createdBy && (
        <Grid item xs={12} sm={4}>
          {" "}
          {/* Grid item, takes full width on xs, 4 columns on sm */}
          <Box sx={styles.userSection}>
            {}
            <Avatar
              src={`${S3}/${request.createdBy.photo}` || "/default_avatar.png"}
              alt={request.createdBy.name}
              sx={styles.avatar}
            />
            <Box sx={styles.userInfoSection}>
              <Typography
                variant="caption"
                sx={{ color: "#757575", marginBottom: "4px" }}
              >
                Created By
              </Typography>
              <Typography sx={styles.userName}>
                {request.createdBy.name}
              </Typography>
            </Box>
          </Box>
        </Grid>
      )}
      {request.assignedBy && (
        <Grid item xs={12} sm={4}>
          {" "}
          {/* Grid item, takes full width on xs, 4 columns on sm */}
          <Box sx={styles.userSection}>
            {}
            <Avatar
              src={`${S3}/${request.assignedBy.photo}` || "/default_avatar.png"}
              alt={request.assignedBy.name}
              sx={styles.avatar}
            />
            <Box sx={styles.userInfoSection}>
              <Typography
                variant="caption"
                sx={{ color: "#757575", marginBottom: "4px" }}
              >
                Assigned By
              </Typography>
              <Typography sx={styles.userName}>
                {request.assignedBy.name}
              </Typography>
            </Box>
          </Box>
        </Grid>
      )}
      {request.assignedTo && (
        <Grid item xs={12} sm={4}>
          {" "}
          {/* Grid item, takes full width on xs, 4 columns on sm */}
          <Box sx={styles.userSection}>
            <Avatar
              src={
                `${S3}/${request.assignedTo.photo}` ||
                `${request.assignedTo.photo}`
              }
              alt={request.assignedTo.name}
              sx={styles.avatar}
            />
            <Box sx={styles.userInfoSection}>
              <Typography
                variant="caption"
                sx={{ color: "#757575", marginBottom: "4px" }}
              >
                Assigned To
              </Typography>
              <Typography sx={styles.userName}>
                {request.assignedTo.name}
              </Typography>
            </Box>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};
export default UserInfo;
