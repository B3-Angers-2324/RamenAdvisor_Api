#Build phase
from node:18.18.2-buster-slim as build
#Set the working directory
WORKDIR /app
#Set the environment variables
ENV PORT=3000
ENV HOST=localhost
ENV NODE_ENV=dev
#Copy dependency list
COPY package.json ./
#Install dependencies
RUN npm install
#Copy the rest of the files
COPY . .
#Build the app
RUN npm run build

#Run phase
FROM node:18.18.2-buster-slim
#Set the working directory
WORKDIR /app
#Set the environment variables
ENV NODE_ENV=prod
#Copy dependency list
COPY package.json ./
#Install dependencies
RUN npm install --only=production
#Copy the builded files from the build phase
COPY --from=build /app/dist ./dist
#Expose the port
EXPOSE ${PORT}
#Link the container to the repository
LABEL org.opencontainers.image.source https://github.com/B3-Angers-2324/RamenAdvisor_Api
#Run the app
CMD ["npm", "run", "start"]



