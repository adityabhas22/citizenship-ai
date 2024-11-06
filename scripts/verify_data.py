import json

def verify_data(extracted_data, reference_file="data/reference_data.json"):
    """
    Verifies extracted key-value pairs against reference records in JSON format, ignoring case sensitivity for both keys and values.

    Args:
        extracted_data (dict): Key-value pairs of extracted information.
        reference_file (str): Path to the JSON file containing reference data.

    Returns:
        dict: A verification report with matched and unmatched fields.
    """
    # Load the reference data from JSON
    try:
        with open(reference_file, "r") as file:
            reference_data = json.load(file)
    except FileNotFoundError:
        print(f"Reference file {reference_file} not found.")
        return None

    # Convert extracted data to lowercase for keys and values
    extracted_data_lower = {str(k).lower(): str(v).lower() for k, v in extracted_data.items()}

    # Initialize a verification report
    verification_report = {"matches": {}, "unmatched": {}}

    # Check each key-value pair in the extracted data
    for key, value in extracted_data_lower.items():
        match_found = False

        # Search for a matching record in reference data (case-insensitive)
        for record in reference_data:
            # Convert the reference record keys and values to lowercase for comparison
            record_lower = {str(k).lower(): str(v).lower() for k, v in record.items()}
            if record_lower.get(key) == value:
                verification_report["matches"][key] = value
                match_found = True
                break

        if not match_found:
            verification_report["unmatched"][key] = value

    return verification_report

def main():
    # Load extracted data from the JSON file
    try:
        with open("data/extracted_data.json", "r") as json_file:
            extracted_data = json.load(json_file)
    except FileNotFoundError:
        print("Extracted data file 'data/extracted_data.json' not found. Please run extract_info.py first.")
        return

    # Verify data against the reference data
    verification_report = verify_data(extracted_data)
    
    # Print verification report
    print("Verification Report:")
    print(json.dumps(verification_report, indent=4))

if __name__ == "__main__":
    main()