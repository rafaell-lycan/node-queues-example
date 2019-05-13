# Use Node latest LTS as the base image.
FROM node:lts-alpine

# create the app directory for inside the Docker image
WORKDIR /worker

# Add everything in the current directory to our image, in the 'worker' folder.
COPY . /worker

# Install dependencies
RUN npm install

# Expose our server port.
# EXPOSE 4567

# Run our app.
CMD ["npm", "start"]
