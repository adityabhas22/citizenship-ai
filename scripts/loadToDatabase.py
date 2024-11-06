import json
import sqlite3

# Load JSON data
with open('data/refined_government_schemes.json') as f:
    schemes_data = json.load(f)

# Connect to SQLite database
conn = sqlite3.connect('data/schemes_database.db')
cursor = conn.cursor()

# Create main table for storing schemes
cursor.execute('''
    CREATE TABLE IF NOT EXISTS schemes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scheme_name TEXT,
        eligibility_criteria TEXT,
        benefits TEXT
    )
''')

# Create FTS virtual table for flexible searching
cursor.execute('''
    CREATE VIRTUAL TABLE IF NOT EXISTS schemes_fts USING fts5(
        scheme_name, eligibility_criteria, benefits
    )
''')

# Insert data into both main table and FTS table if not a duplicate
for scheme in schemes_data:
    eligibility_criteria_json = json.dumps(scheme['eligibility_criteria'])
    benefits_json = json.dumps(scheme['benefits'])
    
    cursor.execute('''
        SELECT COUNT(*) FROM schemes 
        WHERE scheme_name = ? AND eligibility_criteria = ? AND benefits = ?
    ''', (scheme['scheme_name'], eligibility_criteria_json, benefits_json))
    if cursor.fetchone()[0] == 0:
        cursor.execute('''
            INSERT INTO schemes (scheme_name, eligibility_criteria, benefits)
            VALUES (?, ?, ?)
        ''', (scheme['scheme_name'], eligibility_criteria_json, benefits_json))

        cursor.execute('''
            INSERT INTO schemes_fts (scheme_name, eligibility_criteria, benefits)
            VALUES (?, ?, ?)
        ''', (scheme['scheme_name'], eligibility_criteria_json, benefits_json))

# Commit changes and close the connection
conn.commit()
conn.close()