#!/bin/sh

# Run the data loading script
python load_data.py

# Run the Flask application
python Server.py