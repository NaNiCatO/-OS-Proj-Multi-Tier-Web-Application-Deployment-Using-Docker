# Use the official Python image from the Docker Hub
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install the required packages
RUN pip install --no-cache-dir -r requirements.txt

# Ensure the script has execute permissions
RUN chmod +x start.sh

# Expose port 5000 to the outside world
EXPOSE 5000

# Run the application
CMD ["sh","start.sh"]