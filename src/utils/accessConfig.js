// accessConfig.js
export const accessConfig = {
  "production line supervisor": ["/maintenance-request"],
  "maintenance supervisor": [
    "/maintenance-request",
    "/production-lines",
    "/production-line-profile",
    "/machine-profile",
    "/summaries",
  ],
  "director supervisor": [
    "/maintenance-request",
    "/production-lines",
    "/production-line-profile",
    "/machine-profile",
    "/stock",
  ],
  "maintenance technical": ["/maintenance-request"],
};
