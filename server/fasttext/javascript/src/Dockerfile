# use node v8 as a parent image
FROM node:8

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# Install any needed packages specified in package.json
RUN npm install
RUN npm install pm2 -g
RUN npm rebuild

# Make port 8080 available to the world outside this container
EXPOSE 4000

# Define environment variable
ENV PORT 4000

# Run app when the container launches
#CMD ["npm", "start"]
CMD ["pm2-runtime", "server.js"]