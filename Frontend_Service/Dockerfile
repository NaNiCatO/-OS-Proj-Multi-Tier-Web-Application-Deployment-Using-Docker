# Stage 1: Build the React application
FROM node:20-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Serve the React application using Nginx
FROM nginx:alpine

# Copy the built React application from the previous stage to the nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]






#nginx listen to only port 80


#command run
# docker run -p 3000:80 react-app
#built docker image to container and start 



#rebuild when change thing
#docker start (name) --build 

#command build
                #(name)
#docker build -t react-app .


            #(image name)
#docker run react-app


                #after deploy
#docker start vigorous_moser
#close container but image not missing 



