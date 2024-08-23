import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

const MAP_FILE = '/cape_python.png'; // 假設你已將地圖圖片放在 public 目錄中

const SA1_CORNERS = [130, 265, 180, 315];
const SA2_CORNERS = [80, 255, 130, 305];
const SA3_CORNERS = [105, 205, 155, 255];

export default function Home() {
  const [gameState, setGameState] = useState({
    p1: 0.2,
    p2: 0.5,
    p3: 0.3,
    searchNum: 1,
    lastKnownPosition: [160, 290],
    sailorPosition: [0, 0],
    areaActual: 0,
    message: '',
    gameOver: false,
  });

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawMap(ctx);
  }, [gameState]);

  function drawMap(ctx) {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      drawSearchAreas(ctx);
      drawScale(ctx);
      drawLastKnownPosition(ctx);
      if (gameState.gameOver) {
        drawSailorPosition(ctx);
      }
    };
    img.src = MAP_FILE;
  }

  function drawSearchAreas(ctx) {
    drawSearchArea(ctx, ...SA1_CORNERS, '1');
    drawSearchArea(ctx, ...SA2_CORNERS, '2');
    drawSearchArea(ctx, ...SA3_CORNERS, '3');
  }

  function drawSearchArea(ctx, x1, y1, x2, y2, label) {
    ctx.strokeStyle = 'white';
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText(label, x1 + 3, y1 + 15);
  }

  function drawScale(ctx) {
    ctx.beginPath();
    ctx.moveTo(20, 370);
    ctx.lineTo(70, 370);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText('0', 8, 370);
    ctx.fillText('50 Nautical Miles', 71, 370);
  }

  function drawLastKnownPosition(ctx) {
    const [x, y] = gameState.lastKnownPosition;
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText('Last Known Position', 10, 20);
  }

  function drawSailorPosition(ctx) {
    const [x, y] = gameState.sailorPosition;
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText('Sailor Found!', 10, 40);
  }

  function generateSailorPosition() {
    const area = Math.floor(Math.random() * 3) + 1;
    let [x1, y1, x2, y2] = [0, 0, 0, 0];
    if (area === 1) [x1, y1, x2, y2] = SA1_CORNERS;
    else if (area === 2) [x1, y1, x2, y2] = SA2_CORNERS;
    else [x1, y1, x2, y2] = SA3_CORNERS;

    const x = Math.floor(Math.random() * (x2 - x1)) + x1;
    const y = Math.floor(Math.random() * (y2 - y1)) + y1;

    setGameState(prevState => ({
      ...prevState,
      sailorPosition: [x, y],
      areaActual: area,
    }));
  }

  function conductSearch(choice) {
    if (gameState.gameOver) return;

    const searchEffectiveness = Math.random() * 0.5 + 0.4; // 40% to 90%
    let found = false;
    let message = '';
    let newP1 = gameState.p1;
    let newP2 = gameState.p2;
    let newP3 = gameState.p3;

    switch(choice) {
      case '1':
        message = 'Searched Area 1';
        if (gameState.areaActual === 1 && Math.random() < searchEffectiveness) found = true;
        newP1 *= (1 - searchEffectiveness);
        break;
      case '2':
        message = 'Searched Area 2';
        if (gameState.areaActual === 2 && Math.random() < searchEffectiveness) found = true;
        newP2 *= (1 - searchEffectiveness);
        break;
      case '3':
        message = 'Searched Area 3';
        if (gameState.areaActual === 3 && Math.random() < searchEffectiveness) found = true;
        newP3 *= (1 - searchEffectiveness);
        break;
    }

    if (found) {
      message = `Sailor found in Area ${gameState.areaActual}!`;
    } else {
      // Normalize probabilities
      const total = newP1 + newP2 + newP3;
      newP1 /= total;
      newP2 /= total;
      newP3 /= total;
    }

    setGameState(prevState => ({
      ...prevState,
      p1: newP1,
      p2: newP2,
      p3: newP3,
      searchNum: prevState.searchNum + 1,
      message,
      gameOver: found,
    }));
  }

  function resetGame() {
    setGameState({
      p1: 0.2,
      p2: 0.5,
      p3: 0.3,
      searchNum: 1,
      lastKnownPosition: [160, 290],
      sailorPosition: [0, 0],
      areaActual: 0,
      message: '',
      gameOver: false,
    });
    generateSailorPosition();
  }

  useEffect(() => {
    generateSailorPosition();
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Search and Rescue Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Search and Rescue Game</h1>
        <canvas ref={canvasRef} width={400} height={400} />
        <div className="game-info">
          <p>Search Number: {gameState.searchNum}</p>
          <p>Probabilities: P1 = {gameState.p1.toFixed(3)}, P2 = {gameState.p2.toFixed(3)}, P3 = {gameState.p3.toFixed(3)}</p>
          <p>{gameState.message}</p>
        </div>
        <div className="game-controls">
          <button onClick={() => conductSearch('1')} disabled={gameState.gameOver}>Search Area 1</button>
          <button onClick={() => conductSearch('2')} disabled={gameState.gameOver}>Search Area 2</button>
          <button onClick={() => conductSearch('3')} disabled={gameState.gameOver}>Search Area 3</button>
          <button onClick={resetGame}>Reset Game</button>
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #282c34;
          color: white;
        }
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
          text-align: center;
        }
        .game-info {
          margin-top: 1rem;
        }
        .game-controls {
          margin-top: 1rem;
        }
        button {
          font-size: 1rem;
          padding: 0.5rem 1rem;
          margin: 0.5rem;
          background-color: #61dafb;
          color: #282c34;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
