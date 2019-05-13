# Use Node latest LTS as the base image.
FROM node:lts-alpine

# create the app directory for inside the Docker image
WORKDIR /app

# Add everything in the current directory to our image, in the 'app' folder.
COPY . /app

# Install dependencies
RUN npm install

# Expose our server port.
EXPOSE 3000

# Run our app.
CMD ["npm", "start"]
