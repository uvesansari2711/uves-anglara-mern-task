# 1. Use an official Node.js runtime as the base image
FROM node:20-alpine

# 2. Set working directory inside the container
WORKDIR /usr/src/app

# 3. Copy only package files first (better layer caching)
COPY package.json yarn.lock ./

# 4. Install dependencies
RUN yarn install

# 5. Copy the rest of the source code
COPY . .

# 6. Build the TypeScript project
RUN yarn build

# 7. Expose the port your app listens on
EXPOSE 5000

# 8. Start the app
CMD ["node", "dist/src/server.js"]
