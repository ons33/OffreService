import pymongo
import pandas as pd
from bson import ObjectId

client = pymongo.MongoClient("mongodb+srv://espritookUserDb:espritookUserDb@cluster0.afyzleb.mongodb.net/?retryWrites=true&w=majority")
db_test = client['test']
competences_collection = db_test['competences']
offreemplois_collection = client['offreMS']['offreemplois']

# Collect historical data
candidatures = list(offreemplois_collection.find({}))
data = []

for candidature in candidatures:
    user_id = candidature['userId']
    job_id = candidature['_id']
    
    # Retrieve user skills
    user_skills_cursor = competences_collection.find({'user': user_id})
    user_skills = [skill['nomCompetence'] for skill in user_skills_cursor]
    
    # Retrieve job requirements
    job_requirements_cursor = offreemplois_collection.find({'_id': ObjectId(job_id)})
    job_requirements = [job['skills'] for job in job_requirements_cursor]
    
    # Prepare the data record
    data.append({
        'user_skills': user_skills,
        'job_requirements': job_requirements
    })

# Create a DataFrame
df = pd.DataFrame(data)

# Save the DataFrame to a CSV file
df.to_csv('data.csv', index=False)
