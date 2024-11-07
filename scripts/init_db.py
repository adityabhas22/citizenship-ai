import sqlite3
import json
import os
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def init_database():
    try:
        # Get the project root directory
        project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
        # Ensure data directory exists
        data_dir = os.path.join(project_root, 'data')
        if not os.path.exists(data_dir):
            os.makedirs(data_dir)
            logger.info(f"Created data directory at {data_dir}")
        
        # Set database path
        db_path = os.path.join(data_dir, 'schemes_database.db')
        logger.info(f"Database path: {db_path}")
        
        # Create/connect to database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Create schemes table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS schemes (
                scheme_name TEXT PRIMARY KEY,
                eligibility_criteria TEXT,
                benefits TEXT
            )
        ''')
        
        # Sample schemes data
        sample_schemes = [
            {
                "scheme_name": "Rural Education Support",
                "eligibility_criteria": {
                    "residence": "rural",
                    "education": "primary",
                    "income": "below 2000"
                },
                "benefits": [
                    "Monthly education allowance",
                    "Free school supplies",
                    "Transportation support"
                ]
            },
            {
                "scheme_name": "Urban Employment Initiative",
                "eligibility_criteria": {
                    "residence": "urban",
                    "age": "between 18 35",
                    "education": "secondary"
                },
                "benefits": [
                    "Job training programs",
                    "Placement assistance",
                    "Skill development workshops"
                ]
            }
        ]
        
        # Insert sample schemes
        for scheme in sample_schemes:
            cursor.execute('''
                INSERT OR REPLACE INTO schemes (scheme_name, eligibility_criteria, benefits)
                VALUES (?, ?, ?)
            ''', (
                scheme["scheme_name"],
                json.dumps(scheme["eligibility_criteria"]),
                json.dumps(scheme["benefits"])
            ))
        
        conn.commit()
        conn.close()
        logger.info("Database initialized successfully with sample schemes")
        
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        raise

if __name__ == "__main__":
    init_database() 