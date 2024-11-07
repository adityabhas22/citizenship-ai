from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import sys
import logging
import sqlite3
from typing import Dict, Any, Optional

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Add the project root directory to Python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

from modules.search_scheme import SchemeDatabase

app = Flask(__name__)
CORS(app)

@app.route('/save-user', methods=['POST'])
def save_user():
    try:
        user_data = request.json
        if not user_data:
            return jsonify({"error": "No data provided"}), 400

        logger.debug(f"Received user data: {user_data}")
        
        # Convert numeric strings to appropriate types
        if 'age' in user_data:
            user_data['age'] = int(user_data['age'])
        if 'income' in user_data:
            user_data['income'] = float(user_data['income'])
        
        # Save to data/user_data.json
        data_path = os.path.join(project_root, 'data', 'user_data.json')
        try:
            with open(data_path, 'w') as f:
                json.dump(user_data, f, indent=4)
            logger.debug(f"Data saved successfully to {data_path}")
        except IOError as e:
            logger.error(f"Failed to write to file: {e}")
            return jsonify({"error": "Failed to save user data"}), 500
        
        # Initialize SchemeDatabase and search for schemes
        try:
            db_path = os.path.join(project_root, 'data', 'schemes_database.db')
            logger.debug(f"Attempting to connect to database at: {db_path}")
            
            db = SchemeDatabase(db_path)
            logger.debug("Successfully connected to database")
            
            logger.debug("Searching for schemes with user data...")
            schemes = db.get_schemes_for_user(user_data)
            logger.debug(f"Retrieved schemes: {schemes}")
            
            db.close()
            logger.debug("Database connection closed")
            
            if schemes is None:
                return jsonify({"error": "No schemes found"}), 404
                
            return jsonify({
                "message": "User data saved successfully",
                "schemes": schemes,
                "user_data": user_data
            }), 200
            
        except Exception as e:
            logger.error(f"Database error details: {str(e)}")
            logger.exception("Full traceback:")  # This will log the full stack trace
            return jsonify({"error": f"Failed to search schemes: {str(e)}"}), 500
        
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        logger.exception("Full traceback:")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3001)