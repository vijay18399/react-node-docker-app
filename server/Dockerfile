FROM node:18
WORKDIR /app
COPY server/package*.json ./
RUN npm install
RUN apt-get update && apt-get install -y texlive-full && apt-get clean
COPY server/. .
EXPOSE 3000
CMD ["node", "index.js"]
