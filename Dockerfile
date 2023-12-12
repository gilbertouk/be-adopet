# Use the official Node.js image as base
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Clone the GitHub repository
RUN git clone https://github.com/gilbertouk/be-adopet.git .

# Install the latest version of Redis
RUN apt-get update && apt-get install -y redis-server

# Start the Redis service
RUN service redis-server start

# Set environment variables
ENV REDIS_URL=redis://localhost:6379 \
    DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE \
    ACCESS_TOKEN_SECRET=your_access_token_secret \
    REFRESH_TOKEN_SECRET=your_refresh_token_secret \
    TOKEN_ISSUER=your_token_issuer

# Install project dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start"]
