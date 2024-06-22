import pymongo
from bson import ObjectId
import sys
import json
import joblib
import scipy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import ast
import os

# Utilisez un chemin absolu vers le fichier vectorizer.pkl
file_path = os.path.join(os.path.dirname(__file__), 'vectorizer.pkl')

# Charger le vectorizer
vectorizer = joblib.load(file_path)

def combine_skills(skills):
    if isinstance(skills, str):
        skills = ast.literal_eval(skills)
    if isinstance(skills[0], list):
        flat_skills = [skill for sublist in skills for skill in sublist]
    else:
        flat_skills = skills
    return ' '.join(flat_skills)

def calculate_matching_percentage(user_skills, job_requirements):
    user_skills_combined = combine_skills(user_skills)
    job_requirements_combined = combine_skills(job_requirements)
    
    user_vector = vectorizer.transform([user_skills_combined])
    job_vector = vectorizer.transform([job_requirements_combined])
    
    similarity = cosine_similarity(user_vector, job_vector)
    matching_percentage = similarity[0][0] * 100
    
    return matching_percentage

try:
    input_data = sys.stdin.read()
    input_json = json.loads(input_data)
    
    user_id = input_json['user_id']
    job_id = input_json['job_id']['_id']  # Extraction de l'ID réel

    client = pymongo.MongoClient("mongodb+srv://espritookUserDb:espritookUserDb@cluster0.afyzleb.mongodb.net/?retryWrites=true&w=majority")
    db_test = client['test']
    competences_collection = db_test['competences']
    offreemplois_collection = client['offreMS']['offreemplois']

    user_skills_cursor = competences_collection.find({'user': user_id})
    user_skills = [nomCompetence['nomCompetence'] for nomCompetence in user_skills_cursor]

    offer_id_object = ObjectId(job_id)
    job_requirements_cursor = offreemplois_collection.find({'_id': offer_id_object})
    job_requirements = [offer['skills'] for offer in job_requirements_cursor]

    matching_percentage = calculate_matching_percentage(user_skills, job_requirements)

    # Assurez-vous que seul le résultat JSON est imprimé
    print(json.dumps({"matching_percentage": matching_percentage}))
except Exception as e:
    # Assurez-vous que seul le résultat JSON est imprimé en cas d'erreur
    print(json.dumps({"error": str(e)}), file=sys.stderr)
