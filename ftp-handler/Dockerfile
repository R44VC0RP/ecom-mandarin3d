# Use Python 3.12 slim as base image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m -u 1000 ftpuser && \
    mkdir -p /app/uploads && \
    chown -R ftpuser:ftpuser /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY entry.py .
COPY .env .

# Set proper permissions
RUN chown -R ftpuser:ftpuser /app && \
    chmod 755 /app/uploads

# Switch to non-root user
USER ftpuser

# Expose FTP ports
EXPOSE 21
EXPOSE 21000-21010

# Set environment variables for passive mode
ENV PYTHONUNBUFFERED=1
ENV FTP_PASV_ADDRESS=0.0.0.0
ENV FTP_PASV_MIN_PORT=21000
ENV FTP_PASV_MAX_PORT=21010

# Run the FTP server
CMD ["python", "entry.py"] 