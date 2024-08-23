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

  // ... 其餘函數保持不變 ...

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
        // ... 樣式保持不變 ...
      `}</style>
    </div>
  );
}
