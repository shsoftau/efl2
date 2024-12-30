import os
import boto3
from botocore.client import Config

def upload_files_to_r2(local_folder, bucket_name, r2_directory, r2_access_key, r2_secret_key, r2_endpoint):
    # Initialize the S3 client for Cloudflare R2
    s3 = boto3.client(
        's3',
        endpoint_url=r2_endpoint,
        aws_access_key_id=r2_access_key,
        aws_secret_access_key=r2_secret_key,
        config=Config(signature_version='s3v4')
    )

    # Iterate over all files in the specified local folder
    for root, _, files in os.walk(local_folder):
        for file in files:
            local_file_path = os.path.join(root, file)
            # Create the key for R2 (directory structure simulation)
            relative_path = os.path.relpath(local_file_path, local_folder)
            r2_key = os.path.join(r2_directory, relative_path).replace('\\', '/')

            print(f"Uploading {local_file_path} to {bucket_name}/{r2_key}")
            try:
                # Upload file to R2
                s3.upload_file(local_file_path, bucket_name, r2_key)
                print(f"Successfully uploaded: {r2_key}")
            except Exception as e:
                print(f"Failed to upload {local_file_path}: {e}")

if __name__ == "__main__":
    # User-defined variables
    local_folder = r"D:\resources\Images\02.Football Team Logos"  # Replace with the local folder path
    bucket_name = "xlsmepl"       # Replace with your R2 bucket name
    r2_directory = "team_logos"  # Replace with desired R2 directory
    r2_access_key = "3c7330f5130c8fac3714f29a6301bc80"       # Replace with your R2 access key
    r2_secret_key = "fcd1a626d579f0ed2f8737362eabc42cf3e3ccc0e6aee885ced4f3fd4e01bc74"       # Replace with your R2 secret key
    r2_endpoint = "https://03d4a3a146e539f4fb0fe54ab42bbd28.r2.cloudflarestorage.com"   # Replace with your R2 endpoint (e.g., https://<account-id>.r2.cloudflarestorage.com)

    upload_files_to_r2(local_folder, bucket_name, r2_directory, r2_access_key, r2_secret_key, r2_endpoint)
