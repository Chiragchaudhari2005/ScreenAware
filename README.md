📂 Project Directory Tree
ScreenAware/

.gitignore

README.md

data/

digital_diet_mental_health.csv # Raw dataset

processed/ # Any cleaned/prepared versions

backend/

requirements.txt # Python dependencies

Dockerfile # (optional) containerization

README.md

app/

__init__.py

main.py # FastAPI entry point (routes & app instance)

models/ # Saved ML models & scalers

risk_model.pkl

mood_model.pkl

cluster_model.pkl

scaler_clf.pkl

scaler_reg.pkl

scaler_cluster.pkl

artifacts.pkl

schemas/ # Input/Output pydantic schemas

user_input.py

services/ # Business logic (prediction functions)

classifier.py

regressor.py

clusterer.py

utils/ # Common helpers (feature engineering, logging)

preprocess.py

ml_training/

train_improved_ml.py # Model training script

evaluate_overfit.py # Train/Test split evaluation script

notebooks/ # Jupyter notebooks for EDA & prototyping

frontend/ # (to be added in Phase 4)

package.json

public/

src/

components/

pages/

services/ # API calls to backend