import React, { useEffect, useState } from 'react';
import './App.css';
import SingleCard from './components/Singlecard';

const cardImages = [
  { "src": "/img/helmet-1.png", matched: false },
  { "src": "/img/potion-1.png", matched: false },
  { "src": "/img/ring-1.png", matched: false },
  { "src": "/img/scroll-1.png", matched: false },
  { "src": "/img/shield-1.png", matched: false },
  { "src": "/img/sword-1.png", matched: false }
];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [ChoiceOne, setChoiceOne] = useState(null);
  const [ChoiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScores, setHighScores] = useState(JSON.parse(localStorage.getItem('highScores')) || []);

  useEffect(() => {
    shuffleCards();
  }, []);

  // Shuffle cards
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, id: index }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setGameOver(false);
  };

  // Handle a choice
  const handleChoice = (card) => {
    if (!ChoiceOne && !card.matched) {
      setChoiceOne(card);
    } else if (!ChoiceTwo && !card.matched) {
      setChoiceTwo(card);
    }
  };

  // Comparing cards through their source
  useEffect(() => {
    if (ChoiceOne && ChoiceTwo) {
      setDisabled(true);

      if (ChoiceOne.src === ChoiceTwo.src) {
        setCards((prevCards) => {
          const newCards = prevCards.map((c) => {
            if (c.src === ChoiceOne.src) {
              return { ...c, matched: true };
            }
            return c;
          });
          if (newCards.every((c) => c.matched)) {
            setGameOver(true); // All cards are matched
          }
          return newCards;
        });
        resetTurn();
      } else {
        // If cards don't match, flip them back after a delay
        setTimeout(resetTurn, 1000);
      }
    }
  }, [ChoiceOne, ChoiceTwo]);

  // Reset Choice & increase turn
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  // Start a new game automatically
  useEffect(() => {
    shuffleCards();
  }, []); // Empty dependency array runs this effect only once on mount

  // Update high scores and check game over condition
  useEffect(() => {
    if (gameOver) {
      const newScores = [...highScores, turns].sort((a, b) => a - b).slice(0, 3);
      setHighScores(newScores);
      localStorage.setItem('highScores', JSON.stringify(newScores));
    }
  }, [gameOver]);

  // Reset high scores
  const resetHighScores = () => {
    setHighScores([]);
    localStorage.removeItem('highScores');
  };

  // Render congratulations message and new game button if game is over
  if (gameOver) {
    return (
      <div className="App">
        <h1>Congratulations!</h1>
        <p>You've matched all the cards!</p>
        <p>Turns: {turns}</p>
        <p>High Scores:</p>
        <ol>
          {highScores.map((score, index) => (
            <li key={index}>{score}</li>
          ))}
        </ol>
        <button onClick={shuffleCards}>Play Again</button>
        <button onClick={resetHighScores}>Reset High Scores</button>
      </div>
    );
  }

  // Render game board
  return (
    <div className="App">
      <h1>Magic Match</h1>
      <div className="high-scores">
        <h2>High Scores</h2>
        <ol>
          {highScores.map((score, index) => (
            <li key={index}>{score}</li>
          ))}
        </ol>
        <button onClick={resetHighScores}>Reset High Scores</button>
      </div>
      <button onClick={shuffleCards}>New Game</button>

      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === ChoiceOne || card === ChoiceTwo || card.matched}
          />
        ))}
      </div>
      <p>Turns: {turns}</p>
    </div>
  );
}

export default App;
