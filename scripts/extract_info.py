import os
import sys
import pytesseract
from PIL import Image
from PyPDF2 import PdfReader
from pdf2image import convert_from_path
import openai
import json
from dotenv import load_dotenv

# Load the OpenAI API key from the .env file
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def image_to_pdf(image_path):
    image = Image.open(image_path)
    pdf_path = os.path.splitext(image_path)[0] + ".pdf"
    image.convert('RGB').save(pdf_path)
    return pdf_path

def extract_text_from_pdf(pdf_path):
    images = convert_from_path(pdf_path)
    text = ""
    for image in images:
        text += pytesseract.image_to_string(image)
    return text

def get_relevant_info(text):
    prompt = f"""
    Extract all relevant information from the following document text and present it as key-value pairs in JSON format. Include fields like name, date of birth (DOB), phone number, address, and any other pertinent details.

    Document Text:
    {text}
    """
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500,
        temperature=0
    )

    result = response['choices'][0]['message']['content'].strip()
    return result

def main(file_path):
    file_ext = os.path.splitext(file_path)[1].lower()
    if file_ext in ['.jpg', '.jpeg', '.png', '.tiff', '.bmp']:
        print("Converting image to PDF...")
        pdf_path = image_to_pdf(file_path)
    elif file_ext == '.pdf':
        pdf_path = file_path
    else:
        print("Unsupported file format.")
        sys.exit(1)

    print("Extracting text from PDF...")
    text = extract_text_from_pdf(pdf_path)

    print("Extracting relevant information using ChatGPT...")
    result = get_relevant_info(text)

    try:
        extracted_data = json.loads(result)
    except json.JSONDecodeError:
        print("Failed to parse JSON.")
        sys.exit(1)

    # Save the extracted data to a JSON file
    with open("data/extracted_data.json", "w") as json_file:
        json.dump(extracted_data, json_file, indent=4)
    
    print("Extraction complete. Data saved to 'data/extracted_data.json'.")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python extract_info.py <file_path>")
        sys.exit(1)
    file_path = sys.argv[1]
    main(file_path)