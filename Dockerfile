# Step 1: Build the Node.js application
FROM node:16-alpine AS build-node

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Increase npm install timeout and set registry
RUN npm set network-timeout 1000000
RUN npm config set registry http://registry.npmjs.org/

# Install Node.js dependencies with retry mechanism
RUN npm install --legacy-peer-deps || \
    (echo "Retrying npm install..." && npm install --legacy-peer-deps) || \
    (echo "Retrying npm install..." && npm install --legacy-peer-deps)

# Copy the rest of the Node.js application
COPY . .

# Step 2: Build the Python environment
FROM python:3.9 AS build-python

WORKDIR /app

# Install Python dependencies directly
RUN pip install pymongo

# Copy the rest of the application
COPY . .

# Step 3: Create the final image
FROM node:16-alpine

# Install Python
RUN apk add --no-cache python3 py3-pip

WORKDIR /app

# Copy the Node.js application from the first stage
COPY --from=build-node /app .

# Copy the Python application from the second stage
COPY --from=build-python /app .

# Ensure the Python script has execute permissions
RUN chmod +x ./matching.py

# Create a symlink to ensure `python` command works
RUN ln -sf /usr/bin/python3 /usr/bin/python || true

# Verify Python installation
RUN python --version

# Debug: Check installed Python packages
RUN python -m pip list

# Expose the port
EXPOSE 3003

# Start the Node.js application
CMD ["node", "src/app.js"]
