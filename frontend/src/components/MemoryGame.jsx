import React, { useState, useEffect } from 'react';
import './MemoryGame.css';

// Emojis for the card pairs, chosen for a wellness theme
const cardIcons = ['🧠', '❤️', '✨', '🌱', '🧘', '☀️', '🌙', '💧'];

// Function to shuffle the cards array
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

// Function to create the initial game board
const generateGameBoard = () => {
  const pairedIcons = [...cardIcons, ...cardIcons];
  return shuffleArray(pairedIcons).map((icon, index) => ({
    id: index,
    icon: icon,
    isFlipped: false,
    isMatched: false,
  }));
};

const MemoryGame = () => {
  const [cards, setCards] = useState(generateGameBoard());
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isBoardLocked, setIsBoardLocked] = useState(false);

  // Check for matches whenever two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsBoardLocked(true); // Lock the board to prevent more clicks
      const [firstCard, secondCard] = flippedCards;
      
      if (firstCard.icon === secondCard.icon) {
        // It's a match!
        setCards(prevCards =>
          prevCards.map(card =>
            card.icon === firstCard.icon ? { ...card, isMatched: true } : card
          )
        );
        setIsBoardLocked(false);
      } else {
        // Not a match, flip them back after a delay
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              (card.id === firstCard.id || card.id === secondCard.id)
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setIsBoardLocked(false);
        }, 1000);
      }
      
      setFlippedCards([]);
      setMoves(prevMoves => prevMoves + 1);
    }
  }, [flippedCards]);

  // Check for win condition
  useEffect(() => {
    const allMatched = cards.every(card => card.isMatched);
    if (cards.length > 0 && allMatched) {
      setIsGameWon(true);
    }
  }, [cards]);

  const handleCardClick = (clickedCard) => {
    // Prevent clicking if board is locked, or card is already flipped/matched
    if (isBoardLocked || clickedCard.isFlipped || clickedCard.isMatched) {
      return;
    }

    // Flip the clicked card
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === clickedCard.id ? { ...card, isFlipped: true } : card
      )
    );
    
    setFlippedCards([...flippedCards, { ...clickedCard, isFlipped: true }]);
  };
  
  const handleRestart = () => {
    setCards(generateGameBoard());
    setFlippedCards([]);
    setMoves(0);
    setIsGameWon(false);
    setIsBoardLocked(false);
  };

  return (
    <div className="memory-game-container">
      <div className="game-header">
        <h2>Memory Match</h2>
        <p>A fun exercise to improve your focus.</p>
        <div className="game-stats">
          <span>Moves: {moves}</span>
        </div>
      </div>

      <div className={`game-board ${isGameWon ? 'game-won' : ''}`}>
        {cards.map(card => (
          <div
            key={card.id}
            className={`game-card ${card.isFlipped || card.isMatched ? 'is-flipped' : ''}`}
            onClick={() => handleCardClick(card)}
          >
            <div className="card-inner">
              <div className="card-front">
                <span>{card.icon}</span>
              </div>
              <div className="card-back">
                <span>?</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {isGameWon && (
        <div className="win-overlay">
          <div className="win-message">
            <h3>Well Done!</h3>
            <p>You completed the game in {moves} moves.</p>
            <button onClick={handleRestart}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;