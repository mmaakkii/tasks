# Base Image
FROM node:14-alpine

WORKDIR /usr

COPY package.json .

# Install dependencies
# RUN npm install ts-node --save-dev
# RUN npm install typescript -g 
RUN npm install
# RUN npm run build

COPY . .
EXPOSE 80
#  Default command
CMD ["npm", "run", "start"]

# rm -rf node_modules package-lock.json && npm install && npm start
