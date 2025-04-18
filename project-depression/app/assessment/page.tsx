'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, ArrowLeft } from 'lucide-react';
import { json } from 'node:stream/consumers';

const questions = [
  {
    id: 1,
    text: "Gender",
    type: "select",
    options: [
      { value: "male", text: "Male" },
      { value: "female", text: "Female" },
    ]
  },
  {
    id: 2,
    text: "Age",
    type: "number",
    placeholder: "Enter your age",
    min: 18,
    max: 59
  },
  {
    id: 3,
    text: "City",
    type: "text",
    placeholder: "Enter your city"
  },
  {
    id: 4,
    text: "Work Hours",
    type: "number",
    placeholder: "Enter your working hours per week",
    min:0,
    max: 12
  },
  {
    id: 5,
    text: "Academic Pressure",
    type: "scale",
    options: [
      { value: 0, text: "None" },
      { value: 1, text: "low" },
      { value: 2, text: "Moderate" },
      { value: 3, text: "High" },
    ]
  },
  {
    id: 6,
    text: "Work Pressure",
    type: "scale",
    options: [
      { value: 0, text: "None" },
      { value: 1, text: "low" },
      { value: 2, text: "Moderate" },
      { value: 3, text: "High" },
    ]
  },
  {
    id: 7,
    text: "Financial Pressure",
    type: "scale",
    options: [
      { value: 0, text: "None" },
      { value: 1, text: "low" },
      { value: 2, text: "Moderate" },
      { value: 3, text: "High" },
    ]
  },
  {
    id: 8,
    text: "CGPA",
    type: "number",
    placeholder: "Enter your CGPA (e.g., 3.5)",
    min: 0,
    max: 10,
    step: 0.01
  },
  {
    id: 9,
    text: "Study Satisfaction",
    type: "scale",
    options: [
      { value: 0, text: "None" },
      { value: 1, text: "low" },
      { value: 2, text: "Moderate" },
      { value: 3, text: "High" },
    ]
  },
  {
    id: 10,
    text: "Job Satisfaction",
    type: "scale",
    options: [
      { value: 0, text: "None" },
      { value: 1, text: "low" },
      { value: 2, text: "Moderate" },
      { value: 3, text: "High" },
    ]
  },
  {
    id: 11,
    text: "Sleep Duration (Hours)",
    type: "number",
    placeholder: "Average hours of sleep per night",
    min: 0,
    max: 24,
    step: 0.5
  },
  {
    id: 12,
    text: "Have you ever had suicidal thoughts?",
    type: "radio",
    options: [
      { value: "yes", text: "Yes" },
      { value: "no", text: "No" },
    ]
  },
  {
    id: 13,
    text: "Family history of mental illness",
    type: "radio",
    options: [
      { value: "yes", text: "Yes" },
      { value: "no", text: "No" },
    ]
  }
];

type Question = {
  id: number;
  text: string;
  type: "select" | "number" | "text" | "scale" | "radio";
  options?: Array<{ value: string | number; text: string }>;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
};

export default function Assessment() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);  // or use a proper type instead of 'any'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [riskResult, setRiskResult] = useState<{
    riskLevel?: string;
    recommendation?: string;
  }>({});
  const [description,setDescription] = useState("");
  
  const [questionAnswers, setQuestionAnswers] = useState<{
    Gender?: number;
    Age?: number;
    "Work Hours"?: number;
    "Academic Pressure"?: number;
    "Work Pressure"?: number;
    "Financial Pressure 2"?: number;
    "Financial Pressure 3"?: number;
    "Financial Pressure 4"?: number;
    "Financial Pressure 5"?: number;
    CGPA?: number;
    "Study Satisfaction"?: number;
    "Job Satisfaction"?: number;
    "Have you ever had suicidal thoughts?"?: number;
    "Family history of mental illness"?: number;
  }>({});

  const handleAnswer = (value: any) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleNext = async () => {
    if (isSubmitting) return;
    
    const currentQuestionObj = questions[currentQuestion];
    const currentAnswer = answers[currentQuestion];

    if (currentAnswer === undefined) return;

    const newQuestionAnswers = { ...questionAnswers };

    switch (currentQuestionObj.text) {
      case "Gender":
        newQuestionAnswers.Gender = currentAnswer === "male" ? 1 : 0;
        break;
      case "Age":
        const validatedAge = Math.max(
          currentQuestionObj.min || 0, 
          Math.min(currentAnswer, currentQuestionObj.max || Infinity)
        );
        newQuestionAnswers.Age = validatedAge;
        break;
      case "Work Hours":
        const validatedWorkHours = Math.max(
          currentQuestionObj.min || 0, 
          Math.min(currentAnswer, currentQuestionObj.max || Infinity)
        );
        newQuestionAnswers["Work Hours"] = validatedWorkHours;
        break;
      case "Academic Pressure":
        newQuestionAnswers["Academic Pressure"] = 
          currentAnswer === 0 ? 0 :
          currentAnswer === 1 ? 1 :
          currentAnswer === 2 ? 2 :
          currentAnswer === 3 ? 3 : currentAnswer;
        break;
      case "Work Pressure":
        newQuestionAnswers["Work Pressure"] = 
          currentAnswer === 0 ? 0 :
          currentAnswer === 1 ? 1 :
          currentAnswer === 2 ? 2 :
          currentAnswer === 3 ? 3 : currentAnswer;
        break;
      case "Financial Pressure":
        switch (currentAnswer) {
          case 0: // None
            newQuestionAnswers["Financial Pressure 2"] = 1;
            newQuestionAnswers["Financial Pressure 3"] = 0;
            newQuestionAnswers["Financial Pressure 4"] = 0;
            newQuestionAnswers["Financial Pressure 5"] = 0;
            break;
          case 1: // Low
            newQuestionAnswers["Financial Pressure 2"] = 0;
            newQuestionAnswers["Financial Pressure 3"] = 1;
            newQuestionAnswers["Financial Pressure 4"] = 0;
            newQuestionAnswers["Financial Pressure 5"] = 0;
            break;
          case 2: // Moderate
            newQuestionAnswers["Financial Pressure 2"] = 0;
            newQuestionAnswers["Financial Pressure 3"] = 0;
            newQuestionAnswers["Financial Pressure 4"] = 1;
            newQuestionAnswers["Financial Pressure 5"] = 0;
            break;
          case 3: // High
            newQuestionAnswers["Financial Pressure 2"] = 0;
            newQuestionAnswers["Financial Pressure 3"] = 0;
            newQuestionAnswers["Financial Pressure 4"] = 0;
            newQuestionAnswers["Financial Pressure 5"] = 1;
            break;
        }
        break;
      case "CGPA":
        const validatedCGPA = Math.max(
          currentQuestionObj.min || 0, 
          Math.min(currentAnswer, currentQuestionObj.max || Infinity)
        );
        newQuestionAnswers.CGPA = validatedCGPA;
        break;
      case "Study Satisfaction":
        newQuestionAnswers["Study Satisfaction"] = 
          currentAnswer === 0 ? 0 :
          currentAnswer === 1 ? 1 :
          currentAnswer === 2 ? 2 :
          currentAnswer === 3 ? 3 : currentAnswer;
        break;
      case "Job Satisfaction":
          newQuestionAnswers["Job Satisfaction"] = 
            currentAnswer === 0 ? 0 :
            currentAnswer === 1 ? 1 :
            currentAnswer === 2 ? 2 :
            currentAnswer === 3 ? 3 : currentAnswer;
        break;
      case "Have you ever had suicidal thoughts?":
        newQuestionAnswers["Have you ever had suicidal thoughts?"] = 
          currentAnswer === "yes" ? 1 : 0;
        break;
      case "Family history of mental illness":
        newQuestionAnswers["Family history of mental illness"] = 
          currentAnswer === "yes" ? 1 : 0;
        break;
    }

    setQuestionAnswers(newQuestionAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsSubmitting(true);
      try {
        const result = await calculateRisk();
        setRiskResult({
          riskLevel: result.riskLevel,
          recommendation: result.recommendation
        });
        setShowResults(true);
      } catch (error) {
        console.error('Error submitting assessment:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const formatAnswersForBackend = () => {
    return {
      Gender: questionAnswers.Gender,
      Age: questionAnswers.Age,
      Work_Hours: questionAnswers["Work Hours"], // Fixed key
      Academic_Pressure: questionAnswers["Academic Pressure"], // Fixed key
      Work_Pressure: questionAnswers["Work Pressure"], // Fixed key
      Financial_Stress_2_0: questionAnswers["Financial Pressure 2"], // Fixed key
      Financial_Stress_3_0: questionAnswers["Financial Pressure 3"], // Fixed key
      Financial_Stress_4_0: questionAnswers["Financial Pressure 4"], // Fixed key
      Financial_Stress_5_0: questionAnswers["Financial Pressure 5"], // Fixed key
      CGPA: questionAnswers.CGPA,
      Study_Satisfaction: questionAnswers["Study Satisfaction"], // Fixed key
      Job_Satisfaction: questionAnswers["Job Satisfaction"], // Fixed key
      Have_you_ever_had_suicidal_thoughts: questionAnswers["Have you ever had suicidal thoughts?"] === 1 ? 1 : 0, // Fixed key
      Family_History_of_Mental_Illness: questionAnswers["Family history of mental illness"] === 1 ? 1 : 0 // Fixed key
    };
};


  const calculateRisk = async () => {
    try {

      const formattedData = formatAnswersForBackend()
      console.log(formattedData);

      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

    const responseData = await response.json();
    console.log('Response:', responseData);
    
    // Set the result state
    setResult(responseData);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calculating risk:', error);
      return {
        riskLevel: "Error",
        recommendation: "Unable to calculate risk. Please try again later."
      };
    }
  };
  
  const renderQuestion = () => {
    const question = questions[currentQuestion] as Question;
    
    switch (question.type) {
      case "select":
        return question.options ? (
          <select
            className="w-full p-4 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={answers[currentQuestion] || ""}
            onChange={(e) => handleAnswer(e.target.value)}
          >
            <option value="">Select an option</option>
            {question.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        ) : null;
      
      case "number":
      return (
        <input
          type="number"
          className="w-full p-4 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          placeholder={question.placeholder}
          min={question.min}
          max={question.max}
          step={question.step}
          value={answers[currentQuestion] || ""}
          onChange={(e) => {
            const inputValue = Number(e.target.value);
            if (question.min !== undefined && inputValue < question.min) {
              handleAnswer(question.min);
            } else if (question.max !== undefined && inputValue > question.max) {
              handleAnswer(question.max);
            } else {
              handleAnswer(inputValue);
            }
          }}
        />
      );
      
      case "text":
        return (
          <input
            type="text"
            className="w-full p-4 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder={question.placeholder}
            value={answers[currentQuestion] || ""}
            onChange={(e) => handleAnswer(e.target.value)}
          />
        );
      
      case "scale":
      case "radio":
        return question.options ? (
          <div className="space-y-4">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full text-left p-4 rounded-lg border ${
                  answers[currentQuestion] === option.value
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-500 hover:bg-indigo-50"
                } transition-colors`}
              >
                {option.text}
              </button>
            ))}
          </div>
        ) : null;
      
      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </button>
          <div className="flex items-center gap-2">
            <Brain className="text-indigo-600" size={24} />
            <span className="font-bold text-xl">MindWell</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {!showResults ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Depression Risk Assessment</h2>
                <span className="text-gray-500">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl mb-6">{questions[currentQuestion].text}</h3>
              {renderQuestion()}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevious}
                className={`px-6 py-2 rounded-md ${
                  currentQuestion === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                disabled={answers[currentQuestion] === undefined || isSubmitting}
              >
                {isSubmitting ? "Processing..." : 
                 currentQuestion === questions.length - 1 ? "Submit" : "Next"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Your Assessment Results</h2>
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Risk Level: {result['status']==1?`high`:`low`}</h3>
              {/* <p className="text-gray-600">{description || ""}</p> */}
            </div>
            <div className="space-y-4">
              <button
                onClick={() => router.push('/')}
                className="w-full py-3 px-4 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Return to Home
              </button>
              <p className="text-sm text-gray-500 text-center">
                Remember: This assessment is not a diagnosis. Always consult with a qualified healthcare provider about your mental health concerns.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}