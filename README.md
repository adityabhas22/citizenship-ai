# Powerful Document Analyzer

This project is designed to analyze documents and recommend government schemes based on user attributes. It includes functionalities for extracting information from documents, verifying data, and searching a database of schemes.

## Project Structure

Run:
    export PYTHONPATH=$(pwd)
    python scripts/run_scheme_search.py
    
    Enter name, gender, marital status etc to find available schemes for you.

The other functions are related to scanning documents and retrieving info, haven't tried that for any formal document yet.
Currently searching the database seems to work fine. # citizenship-ai



## Setup Instructions - For other parts of the project.

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   cd Powerful Document Analyzer
   ```

2. **Set Up a Virtual Environment:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install Dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set Up Environment Variables:**

   Create a `.env` file in the root directory and add your OpenAI API key:

   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Load Schemes into the Database:**

   Run the script to load schemes into the SQLite database:

   ```bash
   python scripts/loadToDatabase.py
   ```

## Running the Scheme Search

To run the scheme search and find available schemes based on user input:

1. **Collect User Data:**

   Run the `run_scheme_search.py` script:

   ```bash
   export PYTHONPATH=$(pwd)
   python scripts/run_scheme_search.py
   ```

   Follow the prompts to enter user information such as name, income, gender, etc.

2. **View Results:**

   The script will output schemes that match the user's criteria.

## Additional Scripts

- **`collect_user_data.py`:** Collects user data interactively and saves it to `user_data.json`.
- **`generate_users.py`:** Generates sample user profiles and saves them to `data/sample_users.json`.
- **`extract_info.py`:** Extracts information from documents using OCR and OpenAI's API.
- **`verify_data.py`:** Verifies extracted data against reference data.

## Notes

- Ensure that the `data/` directory contains the necessary JSON files and the SQLite database.
- The `modules/` directory contains reusable code for interacting with the database.
- The project uses OpenAI's API for extracting information from documents. Ensure your API key is set in the `.env` file.

## Contributing

Feel free to submit issues or pull requests to improve the project. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.