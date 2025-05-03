
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN apt-get update && apt-get install -y   texlive-full   && apt-get clean
COPY . .
CMD ["node", "index.js"]
