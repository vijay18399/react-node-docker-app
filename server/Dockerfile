FROM node:18
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
RUN apt-get update && apt-get install -y texlive-full && apt-get clean
COPY backend/. .
EXPOSE 3000
CMD ["node", "index.js"]
