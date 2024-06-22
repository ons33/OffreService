import pymongo
from bson import ObjectId
import sys
import json

# Define your matching algorithm function
def calculate_matching_percentage(user_skills, job_requirements):
    total_matching_skills = 0
    total_job_requirements = 0

    for sublist in job_requirements:
        matching_skills_count = len(set(user_skills) & set(sublist))
        total_matching_skills += matching_skills_count
        total_job_requirements += len(sublist)

    # Calculate the matching percentage
    if total_job_requirements > 0:
        matching_percentage = (total_matching_skills / total_job_requirements) * 100
    else:
        matching_percentage = 0

    return matching_percentage

# Connect to MongoDB and retrieve user skills and job requirements
try:
    client = pymongo.MongoClient("mongodb+srv://espritookUserDb:espritookUserDb@cluster0.afyzleb.mongodb.net/?retryWrites=true&w=majority")
    db_test = client['test']
    competences_collection = db_test['competences']
    offreemplois_collection = client['offreMS']['offreemplois']

    # Retrieve user skills based on user ID
    user_skills_cursor = competences_collection.find({'user': sys.argv[1]})
    user_skills = [nomCompetence['nomCompetence'] for nomCompetence in user_skills_cursor]

    # Retrieve job requirements based on offer ID
    offer_id_object = ObjectId(sys.argv[2])
    job_requirements_cursor = offreemplois_collection.find({'_id': offer_id_object})
    job_requirements = [offer['skills'] for offer in job_requirements_cursor]

    # Calculate matching percentage using the retrieved data
    matching_percentage = calculate_matching_percentage(user_skills, job_requirements)

    # Print the matching percentage
    print(json.dumps({"matching_percentage": matching_percentage}))  # Convert to JSON format and print
except Exception as e:
    print(json.dumps({"error": str(e)}))  # Print error in JSON format
