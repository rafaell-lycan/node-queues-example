# Use the latest version of Node
FROM mhart/alpine-node:latest

# Create app directory
WORKDIR /app

# Install PM2 globally
RUN yarn global add pm2

# Expose port 8080
EXPOSE 8080

# Run process via pm2
CMD ["pm2-runtime", "start", "process_dev.json", "--env production"]
