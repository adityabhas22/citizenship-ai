import sqlite3
import json

class SchemeDatabase:
    def __init__(self, db_path='data/schemes_database.db'):
        self.conn = sqlite3.connect(db_path)
        self.cursor = self.conn.cursor()

    def get_schemes_for_user(self, user):
        matching_schemes = []
        self.cursor.execute('SELECT scheme_name, eligibility_criteria, benefits FROM schemes')
        all_schemes = self.cursor.fetchall()

        user_income = user.get("income")
        for scheme_name, eligibility_criteria_json, benefits_json in all_schemes:
            eligibility_criteria = json.loads(eligibility_criteria_json)
            benefits = json.loads(benefits_json)

            if self.is_matching_scheme(user, user_income, eligibility_criteria):
                matching_schemes.append((scheme_name, eligibility_criteria, benefits))

        return self.format_results(matching_schemes)

    def is_matching_scheme(self, user, user_income, eligibility_criteria):
        if "income" in eligibility_criteria:
            if not self.match_income(user_income, eligibility_criteria["income"]):
                return False

        if "gender" in eligibility_criteria:
            if not self.match_gender(user.get("gender"), eligibility_criteria["gender"]):
                return False

        if "age" in eligibility_criteria:
            if not self.match_age(user.get("age"), eligibility_criteria["age"]):
                return False

        if "residence" in eligibility_criteria:
            if not self.match_residence(user.get("residence"), eligibility_criteria["residence"]):
                return False

        if "disability" in eligibility_criteria:
            if not self.match_disability(user.get("disability"), eligibility_criteria["disability"]):
                return False

        if "family_status" in eligibility_criteria:
            if not self.match_family_status(user.get("family_status"), eligibility_criteria["family_status"]):
                return False

        if "education" in eligibility_criteria:
            if not self.match_education(user.get("education"), eligibility_criteria["education"]):
                return False

        return True

    def match_income(self, user_income, income_criteria):
        if user_income is None:
            return True

        income_criteria = income_criteria.lower()
        is_annual = "annual" in income_criteria
        is_below_limit = "below" in income_criteria

        max_income = None
        try:
            max_income = int(''.join(filter(str.isdigit, income_criteria)))
        except ValueError:
            return True

        if is_annual:
            user_income *= 12

        if is_below_limit:
            return user_income <= max_income

        return True

    def match_gender(self, user_gender, gender_criteria):
        if not user_gender:
            return True
        return user_gender.lower() == gender_criteria.lower()

    def match_age(self, user_age, age_criteria):
        if user_age is None or "between" not in age_criteria.lower():
            return True
        age_range = [int(s) for s in age_criteria.split() if s.isdigit()]
        return age_range[0] <= user_age <= age_range[1]

    def match_residence(self, user_residence, residence_criteria):
        if not user_residence:
            return True
        return user_residence.lower() in residence_criteria.lower()

    def match_disability(self, user_disability, disability_criteria):
        if not user_disability:
            return True
        return user_disability.lower() in disability_criteria.lower()

    def match_family_status(self, user_family_status, family_status_criteria):
        if not user_family_status:
            return True
        return user_family_status.lower() in family_status_criteria.lower()

    def match_education(self, user_education, education_criteria):
        if not user_education:
            return True
        return user_education.lower() in education_criteria.lower()

    def format_results(self, results):
        structured_output = []
        unique_entries = set()

        for result in results:
            scheme_name, eligibility_criteria, benefits = result

            entry_id = (scheme_name, json.dumps(eligibility_criteria), json.dumps(benefits))
            if entry_id in unique_entries:
                continue

            unique_entries.add(entry_id)

            output = f"\n**Scheme Name**: {scheme_name}\n"
            output += "  **Eligibility Criteria**:\n"
            for key, value in eligibility_criteria.items():
                output += f"    - {key.capitalize()}: {value}\n"
            output += "  **Benefits**:\n"
            for benefit in benefits:
                output += f"    - {benefit}\n"

            structured_output.append(output)

        return "\n".join(structured_output)

    def close(self):
        self.conn.close()