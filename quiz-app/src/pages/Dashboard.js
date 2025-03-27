import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Mock data for quizzes (in a real app, this would come from an API)
const mockQuizzes = [
  {
    id: 1,
    title: "General Knowledge",
    description: "Test your knowledge across various topics",
    questions: 10,
    timeLimit: "10 minutes",
    difficulty: "Medium",
    participants: 1234
  },
  {
    id: 2,
    title: "Science Quiz",
    description: "Explore the wonders of science",
    questions: 15,
    timeLimit: "15 minutes",
    difficulty: "Hard",
    participants: 856
  },
  {
    id: 3,
    title: "History Challenge",
    description: "Journey through historical events",
    questions: 12,
    timeLimit: "12 minutes",
    difficulty: "Easy",
    participants: 2341
  }
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleCreateQuiz = () => {
    navigate('/create-quiz');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-purple-600">QuizMaster</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Create Quiz Button */}
        <div className="mb-8">
          <button
            onClick={handleCreateQuiz}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Quiz
          </button>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-900">{quiz.title}</h3>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {quiz.difficulty}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">{quiz.description}</p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span className="mr-4">⏱ {quiz.timeLimit}</span>
                  <span className="mr-4">❓ {quiz.questions} questions</span>
                  <span>👥 {quiz.participants}</span>
                </div>
                <button
                  onClick={() => handleStartQuiz(quiz.id)}
                  className="mt-4 w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;