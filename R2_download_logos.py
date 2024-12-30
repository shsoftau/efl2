import os
import csv
import requests

def download_images_from_csv(csv_file_path, save_directory):
    """
    Downloads .png image files listed in a CSV file and saves them to the specified local directory.

    Args:
        csv_file_path (str): Path to the CSV file containing the list of image URLs.
        save_directory (str): Directory where the images will be saved.
    """
    # Ensure the save directory exists
    os.makedirs(save_directory, exist_ok=True)

    # Read the CSV file
    try:
        with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
            reader = csv.reader(csv_file)
            headers = next(reader)  # Read the header row

            if 'URL' not in headers:
                raise ValueError("The CSV file must contain a column named 'URL'.")

            url_index = headers.index('URL')

            for row in reader:
                image_url = row[url_index]

                # Get the image filename from the URL
                image_name = os.path.basename(image_url)

                # Set the local save path
                save_path = os.path.join(save_directory, image_name)

                try:
                    # Download the image
                    print(f"Downloading {image_url}...")
                    response = requests.get(image_url, stream=True)
                    response.raise_for_status()

                    # Save the image locally
                    with open(save_path, 'wb') as image_file:
                        for chunk in response.iter_content(chunk_size=8192):
                            image_file.write(chunk)

                    print(f"Saved: {save_path}")
                except requests.RequestException as e:
                    print(f"Failed to download {image_url}: {e}")
    except FileNotFoundError:
        print(f"CSV file not found: {csv_file_path}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # User-defined attributes
    csv_file_path = r"C:\Temp\logo_urls.csv"
    save_directory = r"D:\resources\Images\02.Football Team Logos"

    download_images_from_csv(csv_file_path, save_directory)
