import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient';

const TriviaModal = ({ newsId, onClose }) => {
  const [trivia, setTrivia] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchTrivia = async () => {
      if (!newsId) return;

      const { data: triviaData, error: triviaError } = await supabase
        .from('trivia')
        .select('id, title')
        .eq('news_id', newsId);

      if (triviaError) {
        console.error('Error fetching trivia:', triviaError);
        return;
      }

      // If trivia exists for the news, set it and fetch its questions
      const currentTrivia = triviaData && triviaData.length > 0 ? triviaData[0] : null;
      setTrivia(currentTrivia);

      if (currentTrivia) {
        // Fetch questions for that trivia
        const { data: questionsData, error: questionsError } = await supabase
          .from('trivia_question')
          .select('id, question_text, options, correct_option')
          .eq('trivia_id', currentTrivia.id);

        if (questionsError) {
          console.error('Error fetching questions:', questionsError);
        } else {
          setQuestions(questionsData);
        }
      }
    };

    fetchTrivia();
  }, [newsId]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    const currentQuestion = questions[currentQuestionIndex];
    if (option === currentQuestion.correct_option) {
      setIsCorrect(true);
      setScore(score + 1);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  if (!trivia || questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full text-center">
            <p className="text-gray-700">No hay trivia disponible para esta noticia.</p>
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                Cerrar
            </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
        {!showResult ? (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{trivia.title}</h2>
            <p className="text-lg text-gray-700 mb-6">{currentQuestion.question_text}</p>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                    selectedOption === null
                      ? 'bg-gray-100 hover:bg-gray-200'
                      : option === currentQuestion.correct_option
                      ? 'bg-green-500 text-white'
                      : option === selectedOption
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {selectedOption && (
              <div className="mt-6 text-center">
                <p className={`font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? '¡Correcto!' : 'Incorrecto'}
                </p>
                <button onClick={handleNextQuestion} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  {currentQuestionIndex < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultado'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">¡Trivia Completada!</h2>
            <p className="text-xl text-gray-700">Tu puntuación: <span className="font-bold text-blue-500">{score} / {questions.length}</span></p>
            <button onClick={onClose} className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TriviaModal;
