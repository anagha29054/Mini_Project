import pickle
import pandas as pd

model = pickle.load(open('../omdl.pkl', 'rb'))

# For most scikit-learn models (if fitted with a DataFrame)
if hasattr(model, 'feature_names_in_'):
    print("Model expects these columns:", model.feature_names_in_)
else:
    print("Model does not store feature names. Check training data.")