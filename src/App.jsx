import CardsGrid from "./componenets/cardsGrid";
import { useState, useEffect } from "react";

function App() {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const stored = localStorage.getItem("bestScore");
    return stored ? parseInt(stored) : 0;
  });
  const [clickedCards, setClickedCards] = useState([]);
  const [pokemonData, setPokemonData] = useState([]); // Store the fetched Pokemon data
  const [shuffledData, setShuffledData] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Save bestScore to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("bestScore", bestScore);
  }, [bestScore]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=12")
      .then((response) => response.json())
      .then((data) => {
        const pokemonWithImages = data.results.map((poke, idx) => ({
          id: idx + 1,
          name: poke.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
            idx + 1
          }.png`,
        }));
        setPokemonData(pokemonWithImages);
        setShuffledData(shuffleArray(pokemonWithImages)); // Shuffle the data initially
      })
      .catch((error) => {
        console.error("Error fetching Pokemon data:", error);
      });
  }, []);

  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function handleCardClick(id) {
    if (clickedCards.includes(id)) {
      setFinalScore(score);
      setGameOver(true); // show game over notification
    } else {
      const newScore = score + 1;
      setScore(newScore);
      setClickedCards([...clickedCards, id]);
      if (newScore > bestScore) {
        setBestScore(newScore);
      }
      setShuffledData(shuffleArray(shuffledData));
    }
  }

  // Shuffle the data when the component mounts
  useEffect(() => {
    if (pokemonData.length > 0) {
      setShuffledData(shuffleArray(pokemonData));
    }
  }, [pokemonData]);

  const responsiveTextSizes =
    " text-[0.6rem] sm:text-[0.8rem] xl:text-[1rem] 2xl:text-[1.4rem] ";
  return (
    <>
      <div
        className={`mainContainer min-h-screen flex flex-col  ${responsiveTextSizes} `}
      >
        <div className="titleContainer bg-background p-2 pb-3 w-[100%] text-center h-fit">
          <p className=" text-black font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            Pokemon Memory Card Game
          </p>
        </div>
        <div className="infoContainer bg-background pr-[10%] pl-[10%] pb-4">
          <div className="gameDescription">
            <div className="descriptionText text-center">
              Try to click each Pokemon only once!
            </div>
          </div>
          <div className="scoresContainer mt-2 mb-2 flex flex-row justify-around">
            <div className="currentScore text-primary">
              Current Score: {score}
            </div>
            <div className="bestScore">Best Score: {bestScore}</div>
          </div>
        </div>
        <div className="gameContainerBG flex flex-col items-center justify-center ">
          <div className="gameContainer grid grid-cols-3 md:grid-cols-4 gap-3 p-3">
            <CardsGrid
              shuffledData={shuffledData}
              onCardClick={handleCardClick}
            ></CardsGrid>
          </div>
        </div>
        <div className="footer mt-auto py-4 text-center">
          <a
            href="https://github.com/Ibrahim-SWE"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="text-[white]">Created by Ibrahim</span>
          </a>
        </div>
      </div>
      {gameOver && (
        <div className="gameOverOverlay">
          <div className="gameOverModal">
            <p>You Lost!</p>
            <p>Your score: {finalScore}</p>
            <button onClick={handleNewGame}>New Game</button>
          </div>
        </div>
      )}
    </>
  );

  function handleNewGame() {
    setScore(0);
    setClickedCards([]);
    setGameOver(false);
    setShuffledData(shuffleArray(pokemonData));
  }
}

export default App;
