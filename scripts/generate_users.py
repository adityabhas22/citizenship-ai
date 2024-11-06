import json

# Sample user profiles
users = [
    {
        "name": "Rajesh Kumar",
        "income": 250000,
        "gender": "male",
        "age": 30,
        "residence": "rural"
    },
    {
        "name": "Anjali Sharma",
        "income": 320000,
        "gender": "female",
        "age": 28,
        "residence": "urban"
    },
    {
        "name": "Amit Singh",
        "income": 180000,
        "gender": "male",
        "age": 45,
        "residence": "rural"
    },
    {
        "name": "Priya Verma",
        "income": 290000,
        "gender": "female",
        "age": 35,
        "residence": "rural"
    },
    {
        "name": "Vivek Reddy",
        "income": 400000,
        "gender": "male",
        "age": 50,
        "residence": "urban"
    },
    {
        "name": "Neha Patil",
        "income": 150000,
        "gender": "female",
        "age": 29,
        "residence": "rural"
    }
]

# Save users to JSON file
with open('data/sample_users.json', 'w') as f:
    json.dump(users, f, indent=4)

print("Sample user profiles generated and saved to 'data/sample_users.json'.")