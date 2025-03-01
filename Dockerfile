# Use Nginx to serve static files
FROM nginx:alpine

# Copy the built frontend files
COPY /var/www/stephan-front /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80