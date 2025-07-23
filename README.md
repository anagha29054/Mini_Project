# 🧠 MindWell: Depression Prediction System  
An AI-powered web platform designed to detect early signs of depression among college students using non-clinical survey data. Built with **FastAPI**, **Next.js**, and a **Random Forest** model, MindWell offers a lightweight, secure, and insightful mental health screening tool.

🔗 **Live Demo**: [depression-prediction-three.vercel.app](https://depression-prediction-three.vercel.app/)

---

## 📌 Problem Statement  
Many students silently suffer from depression due to stigma, unawareness, or lack of access to mental health resources. Existing solutions often require clinical data, making them inaccessible for proactive, large-scale screening.

---

## ✅ Our Solution  
MindWell bridges this gap by:

- Offering an anonymous, easy-to-use assessment interface  
- Leveraging a Random Forest model trained on lifestyle and psychological survey data  
- Delivering personalized insights based on predicted depression risk  
- Operating with minimal system resources while ensuring quick predictions  
- Serving as a supportive tool for students, researchers, and healthcare professionals

---

## 🚀 Features  

### 🧍 User Module  
- Fill out anonymous assessment questionnaires  
- Real-time depression risk analysis  
- Clear result categorization: **High Risk** or **Low Risk**  
- Intuitive interface with smooth navigation  

### 🧑‍⚕️ Counselor/Researcher Utility  
- Can be used as a preliminary filter in university wellness centers  
- Supports large-scale non-clinical screening  
- Portable, secure and customizable system  

---

## 🛠️ Tech Stack  

| Layer     | Technology         |
|-----------|--------------------|
| Frontend  | Next.js (React.js) |
| Backend   | FastAPI (Python)   |
| ML Model  | Random Forest (Sklearn) |
| Database  | Excel Dataset      |
| Hosting   | Vercel (Frontend), Local/Cloud (Backend) |

---

## ⚙️ Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/anagha29054/Mini_Project.git
   cd Mini_Project
   ```

2. **Backend Setup (FastAPI + ML)**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

3. **Frontend Setup (Next.js)**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

