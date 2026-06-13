# Base image
FROM nginx:1.31-alpine
    
# Expose HTTP port
EXPOSE 80

# Copy custom Nginx config
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Allow Nginx to serve any development files (for debugging)
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]