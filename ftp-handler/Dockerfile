# Use Python 3.12 slim as base image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user and set up directories with proper permissions
RUN useradd -m -u 1000 ftpuser && \
    mkdir -p /app/uploads && \
    chown -R ftpuser:ftpuser /app && \
    chmod 755 /app && \
    chmod 777 /app/uploads

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY entry.py .
COPY .env .

# Set proper permissions for application files
RUN chown -R ftpuser:ftpuser /app && \
    chmod 644 /app/entry.py /app/.env && \
    chmod 755 /app/uploads

# Switch to non-root user
USER ftpuser

# Expose FTP ports
EXPOSE 21
EXPOSE 21000-21010

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    FTP_PASV_ADDRESS=0.0.0.0 \
    FTP_PASV_MIN_PORT=21000 \
    FTP_PASV_MAX_PORT=21010

# Create volume for uploads
VOLUME ["/app/uploads"]

# Run the FTP server
CMD ["python", "entry.py"] 