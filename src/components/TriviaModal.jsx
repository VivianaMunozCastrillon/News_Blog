import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { CgClose } from 'react-icons/cg';
import { UserAuth } from '../context/AuthContext';

const TriviaModal = ({ newsId, onClose }) => {
  // --- ESTADOS DEL COMPONENTE ---
  const [trivia, setTrivia] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // Clave: Almacena las respuestas del usuario { questionId: answer }
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [finalPoints, setFinalPoints] = useState(0); // Almacenará los puntos finales, no solo los aciertos
  const [showResult, setShowResult] = useState(false);
  const { user } = UserAuth();

  // --- CARGA DE DATOS (Sin cambios, tu lógica era perfecta) ---
  useEffect(() => {
    const fetchTrivia = async () => {
      if (!newsId) return;

      try {
        const { data: triviaData, error: triviaError } = await supabase
          .from('trivia')
          .select('id, title')
          .eq('news_id', newsId)
          .maybeSingle(); // .maybeSingle() es ideal aquí

        if (triviaError) throw triviaError;

        setTrivia(triviaData);

        if (triviaData) {
          const { data: questionsData, error: questionsError } = await supabase
            .from('trivia_question')
            .select('id, question_text, options, correct_option')
            .eq('trivia_id', triviaData.id);

          if (questionsError) throw questionsError;
          setQuestions(questionsData);
        }
      } catch (error) {
        console.error('Error al cargar la trivia:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrivia();
  }, [newsId]);

  // --- FUNCIÓN CENTRAL PARA CALCULAR Y GUARDAR PUNTOS (Lógica Refactorizada) ---
  const calculateAndSaveScore = async () => {
    // 1. Calcular el número de respuestas correctas
    let correctAnswersCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correct_option) {
        correctAnswersCount++;
      }
    });

    // 2. Aplicar la lógica de puntuación
    const pointsPerCorrectAnswer = 5;
    const bonusForAllCorrect = 10;
    let calculatedPoints = correctAnswersCount * pointsPerCorrectAnswer;
    const allCorrect = correctAnswersCount === questions.length && questions.length > 0;

    if (allCorrect) {
      calculatedPoints += bonusForAllCorrect;
    }

    setFinalPoints(calculatedPoints); // Actualiza el estado para la UI

    // 3. Guardar los puntos usando la función RPC segura (si el usuario está logueado y ganó puntos)
    if (user && calculatedPoints > 0) {
      const { error } = await supabase.rpc('add_user_points', {
        points_to_add: calculatedPoints,
      });

      if (error) {
        console.error('Error al guardar la puntuación vía RPC:', error.message);
      } else {
        console.log(`¡${calculatedPoints} puntos guardados con éxito para ${user.id}!`);
      }
    }

    // 4. Mostrar la pantalla de resultados
    setShowResult(true);
  };

  // --- MANEJADORES DE INTERACCIÓN ---
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    const currentQuestion = questions[currentQuestionIndex];
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
    setIsCorrect(option === currentQuestion.correct_option);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateAndSaveScore();
    }
  };

  // --- RENDERIZADO ---
  if (loading) {
    // Pantalla de carga mientras se busca la trivia
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl">Cargando trivia...</div>
        </div>
    );
  }

  if (!trivia || questions.length === 0) {
    // Pantalla si no hay trivia disponible
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="relative bg-white p-8 rounded-lg shadow-2xl max-w-md w-full text-center">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                <CgClose size={24} />
            </button>
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
      <div className="relative bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <CgClose size={24} />
        </button>
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
            <p className="text-xl text-gray-700">Has ganado: <span className="font-bold text-blue-500">{finalPoints} puntos</span></p>
            {user && finalPoints > 0 && <p className="text-md text-gray-600 mt-2">¡Puntos añadidos a tu perfil!</p>}
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