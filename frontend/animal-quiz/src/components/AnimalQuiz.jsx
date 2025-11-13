import React, { useState } from "react";

import "./AnimalQuiz.css"; 


const BASE = process.env.REACT_APP_API_URL;

const AnimalQuiz = () => {
  const [animal, setAnimal] = useState("");
  const [data, setData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleGenerate = async () => {
    if (!animal) return alert("Please enter an animal name");
    setLoading(true);
    setScore(null);

    try {
      const response = await fetch(`${BASE}api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animal }),
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (index, option) => {
    setSelectedAnswers({ ...selectedAnswers, [index]: option });
  };

  const handleSubmitQuiz = () => {
    let scoreCount = 0;
    data.quiz.forEach((q, i) => {
      if (selectedAnswers[i] === q.answer) scoreCount++;
    });
    setScore(scoreCount);
  };

  return (
    <div className="animal-quiz-container">
      <h1 className="quiz-heading">🐾 Animal Encyclopedia & Quiz</h1>

      {/* Input Section */}
      {!data && (
        <div className="input-section">
          <input
            type="text"
            placeholder="Enter an animal name (e.g., Elephant)"
            value={animal}
            onChange={(e) => setAnimal(e.target.value)}
          />
          <button onClick={handleGenerate}>
            {loading ? <div className="spinner"></div> : "Generate"}
          </button>
        </div>
      )}

      {/* Animal Info */}
      {data && data.info && !showQuiz && (
        <div className="info-card fade-in">
          <h2 className="animal-name">{animal.toUpperCase()}</h2>
          <p><strong>Scientific Name:</strong> {data.info.scientific_name}</p>
          <p><strong>Habitat:</strong> {data.info.habitat}</p>
          <p><strong>Geographical Distribution:</strong> {data.info.geographical_distribution}</p>
          <p><strong>Diet:</strong> {data.info.diet}</p>
          <p><strong>Lifespan:</strong> {data.info.average_lifespan}</p>
          <p><strong>Behavior:</strong> {data.info.behavior_and_social_structure}</p>
          <p><strong>Reproduction:</strong> {data.info.reproduction_and_offspring}</p>
          <p><strong>Conservation Status:</strong> {data.info.conservation_status}</p>

          <div className="facts-container">
            <h3>🌟 Interesting Facts</h3>
            {data.info.interesting_facts?.map((fact, idx) => (
              <div key={idx} className="fact-box">
                {fact}
              </div>
            ))}
          </div>

          <button onClick={() => setShowQuiz(true)} className="quiz-btn">
            🎯 Take Quiz
          </button>
        </div>
      )}

      {/* Quiz Section */}
      {data && data.quiz && showQuiz && (
        <div className="quiz-section fade-in">
          <h2>🧠 Quiz Time</h2>
          {data.quiz.map((q, i) => {
            const userAnswer = selectedAnswers[i];
            const isCorrect = userAnswer === q.answer;
            return (
              <div
                key={i}
                className={`question-card ${
                  score !== null
                    ? isCorrect
                      ? "correct"
                      : "incorrect"
                    : ""
                }`}
              >
                <p className="question-text">
                  <strong>Q{i + 1}:</strong> {q.question}
                </p>

                <div className="options">
                  {q.options.map((option, j) => (
                    <button
                      key={j}
                      className={`option-btn ${
                        userAnswer === option ? "selected" : ""
                      }`}
                      onClick={() => handleOptionSelect(i, option)}
                      disabled={score !== null}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {/* Show correct answer after submission */}
                {score !== null && !isCorrect && (
                  <p className="answer-feedback">
                    ❌ Your answer: <strong>{userAnswer || "Not answered"}</strong><br />
                    ✅ Correct answer: <strong>{q.answer}</strong>
                  </p>
                )}
              </div>
            );
          })}

          {score === null && (
            <button onClick={handleSubmitQuiz} className="submit-btn">
              ✅ Submit Quiz
            </button>
          )}

          {score !== null && (
            <div className="result-box fade-in">
              <h3>
                🎉 You scored <span>{score}</span> / {data.quiz.length}
              </h3>
              <button onClick={() => window.location.reload()} className="restart-btn">
                🔁 Try Another Animal
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnimalQuiz;
