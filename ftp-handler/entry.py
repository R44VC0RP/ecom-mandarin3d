import os
from datetime import datetime, timedelta
import json
import requests
import mimetypes
import resend
from pyftpdlib.authorizers import DummyAuthorizer
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import FTPServer
import dotenv

dotenv.load_dotenv()

UPLOAD_LIMIT = 5  # Maximum allowed files per hour
upload_records = {}  # Dictionary to track upload timestamps per user

# UploadThing Configuration
UPLOADTHING_API_KEY = os.getenv('UPLOADTHING_API_KEY')
UPLOADTHING_API_URL = "https://api.uploadthing.com/v6/uploadFiles"

# Resend Configuration
RESEND_API_KEY = os.getenv('RESEND_API_KEY')
NOTIFICATION_EMAIL = "ryan@mandarin3d.com"

def send_notification_email(file_name: str, file_url: str, file_type: str):
    try:
        if not RESEND_API_KEY:
            print("Warning: RESEND_API_KEY not set. Skipping email notification.")
            return False

        resend.api_key = RESEND_API_KEY
        
        html_content = f"""
        <h2>New File Upload Notification</h2>
        <p>A new file has been successfully uploaded to UploadThing:</p>
        <ul>
            <li><strong>File Name:</strong> {file_name}</li>
            <li><strong>File Type:</strong> {file_type}</li>
            <li><strong>Upload URL:</strong> <a href="{file_url}">{file_url}</a></li>
        </ul>
        <p>This is an automated notification from your FTP Handler.</p>
        """

        params = {
            "from": "FTP Handler <contact@mail.mandarin3d.com>",
            "to": [NOTIFICATION_EMAIL],
            "subject": f"New File Upload: {file_name}",
            "html": html_content
        }

        email = resend.Emails.send(params)
        print(f"Email notification sent: {email}")
        return True

    except Exception as e:
        print(f"Error sending email notification: {str(e)}")
        return False

def upload_to_uploadthing(file_path):
    try:
        # Get file information
        file_name = os.path.basename(file_path)
        file_size = os.path.getsize(file_path)
        
        # Detect MIME type
        file_type, _ = mimetypes.guess_type(file_path)
        if not file_type:
            file_type = 'application/octet-stream'  # Default to binary if type unknown
        
        # Prepare headers for UploadThing API
        headers = {
            'Content-Type': 'application/json',
            'x-uploadthing-api-key': UPLOADTHING_API_KEY,
            'x-uploadthing-version': '6.4.0'
        }
        
        # Prepare the request payload
        payload = {
            "files": [{
                "name": file_name,
                "size": file_size,
                "type": file_type,
                "contentDisposition": "inline"
            }]
        }
        
        print(f"Sending payload to UploadThing: {json.dumps(payload, indent=2)}")
        
        # Get presigned URL
        response = requests.post(
            UPLOADTHING_API_URL,
            headers=headers,
            json=payload
        )
        
        if response.status_code != 200:
            print(f"Failed to get presigned URL: {response.text}")
            return False
            
        presigned_data = response.json()['data'][0]
        
        # Upload the file using the presigned URL
        with open(file_path, 'rb') as file:
            upload_response = requests.post(
                presigned_data['url'],
                data=presigned_data['fields'],
                files={'file': file}
            )
            
        if upload_response.status_code not in [200, 201, 204]:
            print(f"Failed to upload file: {upload_response.text}")
            return False
            
        print(f"Successfully uploaded file to UploadThing: {presigned_data['fileUrl']}")
        
        # Send email notification
        send_notification_email(file_name, presigned_data['fileUrl'], file_type)
        
        return True
        
    except Exception as e:
        print(f"Error uploading to UploadThing: {str(e)}")
        return False

class MyFTPHandler(FTPHandler):
    def on_file_received(self, file_path):
        # Use username if available, otherwise fallback to remote IP
        user = self.username if self.username else self.remote_ip
        now = datetime.now()

        # Initialize or update the user's upload record
        if user not in upload_records:
            upload_records[user] = []
        # Keep only timestamps within the last hour
        upload_records[user] = [
            ts for ts in upload_records[user] if now - ts < timedelta(hours=1)
        ]

        if len(upload_records[user]) >= UPLOAD_LIMIT:
            # Rate limit exceeded: remove the file and inform the client
            os.remove(file_path)
            self.respond("550 Rate limit exceeded. Please try again later.")
            print(f"Upload rejected for {user}: rate limit exceeded")
            return

        # Record the new upload and process the file as needed
        upload_records[user].append(now)
        print(f"File received from {user}: {file_path}")
        
        # Upload to UploadThing
        if not UPLOADTHING_API_KEY:
            print("Warning: UPLOADTHING_API_KEY not set. Skipping upload.")
            os.remove(file_path)  # Delete file if we can't process it
            return
            
        if upload_to_uploadthing(file_path):
            print(f"Successfully processed file: {file_path}")
            # Delete the file after successful upload
            try:
                os.remove(file_path)
                print(f"Successfully deleted processed file: {file_path}")
            except OSError as e:
                print(f"Error deleting processed file: {str(e)}")
        else:
            print(f"Failed to process file: {file_path}")
            # Delete the file if upload failed
            try:
                os.remove(file_path)
                print(f"Deleted failed upload file: {file_path}")
            except OSError as e:
                print(f"Error deleting failed file: {str(e)}")

    def list_directory(self, path):
        """Custom directory listing that only shows readme.txt"""
        readme_path = os.path.join(path, "readme.txt")
        # Create readme.txt if it doesn't exist
        if not os.path.exists(readme_path):
            with open(readme_path, "w") as f:
                f.write("Welcome to Mandarin3D FTP Upload Service\n")
                f.write("You can upload files to this directory.\n")
                f.write("Files will be automatically processed after upload.\n")

        # Only list readme.txt
        if self.use_list_a:
            listing = []
            try:
                st = os.stat(readme_path)
                listing.append(self.format_list(readme_path, st))
            except OSError:
                pass
            return listing
        else:
            listing = []
            try:
                st = os.stat(readme_path)
                listing.append(self.format_mlsx(readme_path, st))
            except OSError:
                pass
            return listing


def main():
    # Ensure uploads directory exists
    if not os.path.exists("uploads"):
        os.makedirs("uploads")

    authorizer = DummyAuthorizer()
    # Allow anonymous write access and limited list access
    authorizer.add_anonymous("uploads/", perm="elw")  # 'e' for enter, 'l' for list, 'w' for write

    handler = MyFTPHandler
    handler.authorizer = authorizer

    server = FTPServer(("0.0.0.0", 21), handler)
    server.serve_forever()


if __name__ == "__main__":
    main()
