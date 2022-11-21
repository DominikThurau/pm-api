FROM node:18
WORKDIR /app
COPY ["package.json", "yarn.lock", "./"]
RUN npm install
COPY . .
CMD ["npm", "start"]