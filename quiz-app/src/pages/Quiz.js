import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Mock quiz data (in a real app, this would come from an API)
const mockQuizData = {
  id: 1,
  title: "General Knowledge",
  description: "Test your knowledge across various topics",
  timeLimit: 10, // in minutes
  questions: [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
      correctAnswer: 2
    }
  ]
};

const Quiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // In a real app, fetch quiz data from API
    setQuiz(mockQuizData);
    setTimeLeft(mockQuizData.timeLimit * 60); // Convert minutes to seconds
  }, [quizId]);

  useEffect(() => {
    if (timeLeft <= 0) {
      finishQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const finishQuiz = () => {
    const score = calculateScore();
    setIsFinished(true);
    // In a real app, send results to backend
    console.log('Quiz finished with score:', score);
  };

  const calculateScore = () => {
    let correct = 0;
    Object.entries(answers).forEach(([questionIndex, answerIndex]) => {
      if (quiz.questions[questionIndex].correctAnswer === answerIndex) {
        correct++;
      }
    });
    return (correct / quiz.questions.length) * 100;
  };

  if (!quiz) return <div>Loading...</div>;

  if (isFinished) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Complete!</h2>
              <div className="mb-6">
                <div className="text-5xl font-bold text-purple-600">{Math.round(score)}%</div>
                <p className="text-gray-600 mt-2">
                  You got {Object.keys(answers).length} out of {quiz.questions.length} questions
                </p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestionData = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-sm p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            <div className="text-xl font-mono text-purple-600">{formatTime(timeLeft)}</div>
          </div>
          <div className="mt-4 h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white shadow-lg rounded-b-xl p-6">
          <div className="mb-8">
            <div className="text-sm text-gray-500 mb-2">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {currentQuestionData.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {currentQuestionData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  answers[currentQuestion] === index
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-500 hover:bg-purple-50'
                }`}
              >
                <span className="inline-block w-8 h-8 rounded-full bg-gray-100 text-center leading-8 mr-3">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className={`px-4 py-2 rounded-md ${
                currentQuestion === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Previous
            </button>
            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={finishQuiz}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Finish Quiz
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;