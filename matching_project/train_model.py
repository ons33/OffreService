import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import ast

# Load the data
df = pd.read_csv('data.csv')

def combine_skills(skills):
    # Flatten the list of lists
    if isinstance(skills, str):
        skills = ast.literal_eval(skills)
    if isinstance(skills[0], list):
        flat_skills = [skill for sublist in skills for skill in sublist]
    else:
        flat_skills = skills
    return ' '.join(flat_skills)

# Combine skills into a single string for each user and job
df['user_skills_combined'] = df['user_skills'].apply(ast.literal_eval).apply(combine_skills)
df['job_requirements_combined'] = df['job_requirements'].apply(ast.literal_eval).apply(combine_skills)

# Combine both skills and requirements into one column for vectorization
combined_skills = pd.concat([df['user_skills_combined'], df['job_requirements_combined']])

# Print out some samples for debugging
print("Sample combined_skills:", combined_skills.head())

# Ensure there are no empty rows before proceeding
if combined_skills.str.strip().empty:
    raise ValueError("DataFrame is empty after filtering out empty skills and requirements")

vectorizer = TfidfVectorizer()
vectorizer.fit(combined_skills)

# Save the vectorizer
joblib.dump(vectorizer, 'vectorizer.pkl')
