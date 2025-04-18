import pickle
import pandas as pd
from fastapi import FastAPI, File, UploadFile, HTTPException, Body
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from tempfile import NamedTemporaryFile
import os
from pydantic import BaseModel


class AssessmentAnswers(BaseModel):
    Gender: int
    Age: int
    Work_Hours: int
    Academic_Pressure: int
    Work_Pressure: int
    Financial_Stress_2_0: int
    Financial_Stress_3_0: int
    Financial_Stress_4_0: int
    Financial_Stress_5_0: int
    CGPA: float
    Study_Satisfaction: int
    Job_Satisfaction: int
    Have_you_ever_had_suicidal_thoughts: int
    Family_History_of_Mental_Illness: int

# Load the trained model
model = pickle.load(open('../omdl.pkl', 'rb'))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend origin
    allow_credentials=True, 
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

@app.post("/predict")
async def predict(answers: AssessmentAnswers = Body(...)):
    try:
        # Convert the Pydantic model to a dictionary (Use model_dump() instead of dict())
        data_dict = answers.model_dump()

        # Convert the dictionary to a DataFrame
        df = pd.DataFrame([data_dict])

        required_columns = [
    'Gender', 'Age', 'Academic Pressure', 'Work Pressure', 'CGPA',
    'Study Satisfaction', 'Job Satisfaction', 'Have you ever had suicidal thoughts ?',
    'Work/Study Hours', 'Family History of Mental Illness', 'Financial Stress_2.0',
    'Financial Stress_3.0', 'Financial Stress_4.0', 'Financial Stress_5.0'
        ]

        # Reorder the DataFrame columns
        df = df.reindex(columns=required_columns)

        # Reorder columns and ensure all required columns exist
        print(df.columns)

        result = model.predict(df)
        return {"status": str(result[0])}
    
    except Exception as e:
        print(e)
        return {"status": "error", "message": str(e)}

        
    #     if not all(col in my_data.columns for col in required_columns):
    #         raise HTTPException(status_code=400, detail="Uploaded file does not have the required columns")

    #     # Use the model to make predictions
    #     result = model.predict(my_data)
        
    #     # Convert prediction values to human-readable risk levels
    #     risk_mapping = {1: "High Risk of Depression", 0: "Low Risk of Depression"}
    #     my_data['Risk Level'] = [risk_mapping[pred] for pred in result]

    #     # Convert the DataFrame to a list of dictionaries
    #     data = my_data.to_dict('records')

    #     # Return the data as a JSON response
    #     return JSONResponse(content={'result': data})
    
    # finally:
    #     # Remove the temporary file
    #     os.unlink(temp_file_path)

@app.get("/", response_class=RedirectResponse)
def redirect_to_docs():
    return "/docs"
