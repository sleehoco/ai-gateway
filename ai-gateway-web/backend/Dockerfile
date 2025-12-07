# Node.js API Server
FROM node:18-alpine

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript (if needed) or run directly with ts-node
# For production, we usually build. For simplicity here, we use ts-node.
# RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
