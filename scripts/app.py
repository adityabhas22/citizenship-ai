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

# Define database path
DB_PATH = os.path.join(project_root, 'data', 'schemes_database.db')

from modules.search_scheme import SchemeDatabase

app = Flask(__name__)
CORS(app)

def init_db():
    """Initialize the database if it doesn't exist"""
    try:
        if not os.path.exists(DB_PATH):
            logger.info(f"Creating new database at {DB_PATH}")
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            # Create schemes table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS schemes (
                    scheme_name TEXT PRIMARY KEY,
                    eligibility_criteria TEXT,
                    benefits TEXT
                )
            ''')
            
            conn.commit()
            conn.close()
            logger.info("Database initialized successfully")
        else:
            logger.info(f"Database already exists at {DB_PATH}")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise

@app.route('/save-user', methods=['POST'])
def save_user():
    try:
        user_data = request.json
        if not user_data:
            return jsonify({"error": "No data provided"}), 400

        logger.debug(f"Received user data: {user_data}")
        
        # Convert numeric strings to appropriate types
        try:
            if 'age' in user_data:
                user_data['age'] = int(float(user_data['age']))
            if 'income' in user_data:
                user_data['income'] = float(user_data['income'])
        except ValueError as e:
            logger.error(f"Error converting numeric values: {e}")
            return jsonify({"error": "Invalid numeric value provided"}), 400
        
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
            db = SchemeDatabase(DB_PATH)  # Pass the correct database path
            schemes = db.get_schemes_for_user(user_data)
            logger.debug(f"Retrieved schemes: {schemes}")
            db.close()
            
            if schemes is None:
                return jsonify({"error": "No schemes found"}), 404
                
            return jsonify({
                "message": "User data saved successfully",
                "schemes": schemes,
                "user_data": user_data
            }), 200
            
        except Exception as e:
            logger.error(f"Database error: {e}")
            logger.exception("Full traceback:")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        logger.exception("Full traceback:")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    try:
        # Initialize database before starting the server
        init_db()
        app.run(debug=True, port=3001)
    except Exception as e:
        logger.error(f"Failed to start server: {e}")