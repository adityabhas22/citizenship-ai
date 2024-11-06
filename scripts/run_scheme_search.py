import json
from modules.search_scheme import SchemeDatabase
from scripts.collect_user_data import collect_user_data

def main():
    # Collect user information
    user_data = collect_user_data()

    # Save user data to a JSON file (optional)
    with open('data/user_data.json', 'w') as f:
        json.dump(user_data, f, indent=4)

    # Initialize the SchemeDatabase
    db = SchemeDatabase(db_path='data/schemes_database.db')

    # Get schemes based on collected user data
    print("Schemes matching user criteria:")
    print(db.get_schemes_for_user(user_data))

    # Close the database connection
    db.close()

if __name__ == "__main__":
    main() 