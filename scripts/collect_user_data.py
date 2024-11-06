import json

def collect_user_data():
    # Collect user data interactively
    user_data = {
        "name": input("Enter your name: "),
        "income": int(input("Enter your monthly income: ")),
        "gender": input("Enter your gender (male/female): "),
        "age": int(input("Enter your age: ")),
        "residence": input("Enter your residence type (urban/rural): "),
        "disability": input("Enter any disability (none if not applicable): "),
        "family_status": input("Enter your family status (single/married): "),
        "education": input("Enter your education level: ")
    }
    return user_data

if __name__ == "__main__":
    # Collect user data and save it to JSON
    user_data = collect_user_data()
    with open('data/user_data.json', 'w') as f:
        json.dump(user_data, f, indent=4)