import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Eye, EyeOff, Trophy } from 'lucide-react';
import Button from '../ui/Button';

const JigsawLevel = ({ level, onComplete }) => {
  const [pieces, setPieces] = useState([]);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [completedPieces, setCompletedPieces] = useState(0);
  const [showPreview, setShowPreview] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const puzzleRef = useRef(null);

  const gridSize = Math.sqrt(level.content.pieces); // 4x4 for 16 pieces
  const pieceSize = 300 / gridSize; // Assuming 300px puzzle size

  // Initialize puzzle pieces
  useEffect(() => {
    const initialPieces = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        initialPieces.push({
          id: row * gridSize + col,
          row,
          col,
          correctX: col * pieceSize,
          correctY: row * pieceSize,
          currentX: Math.random() * 200 + 350, // Random position on the right
          currentY: Math.random() * 200 + 50,
          width: pieceSize,
          height: pieceSize,
          isPlaced: false,
          backgroundPosition: `-${col * pieceSize}px -${row * pieceSize}px`
        });
      }
    }
    setPieces(initialPieces);
  }, [gridSize, pieceSize]);

  // Timer
  useEffect(() => {
    let interval;
    if (gameStarted && completedPieces < level.content.pieces) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, completedPieces, level.content.pieces]);

  // Check completion
  useEffect(() => {
    if (completedPieces === level.content.pieces && completedPieces > 0) {
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  }, [completedPieces, level.content.pieces, onComplete]);

  const handleDragStart = (e, piece) => {
    if (!gameStarted) setGameStarted(true);
    setDraggedPiece(piece);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedPiece) return;

    const rect = puzzleRef.current.getBoundingClientRect();
    const dropX = e.clientX - rect.left;
    const dropY = e.clientY - rect.top;

    const tolerance = 30;
    const isCorrectPosition = 
      Math.abs(dropX - draggedPiece.correctX) < tolerance &&
      Math.abs(dropY - draggedPiece.correctY) < tolerance;

    setPieces(prev => prev.map(piece => {
      if (piece.id === draggedPiece.id) {
        if (isCorrectPosition && !piece.isPlaced) {
          setCompletedPieces(count => count + 1);
          return {
            ...piece,
            currentX: piece.correctX,
            currentY: piece.correctY,
            isPlaced: true
          };
        } else {
          return {
            ...piece,
            currentX: dropX - piece.width / 2,
            currentY: dropY - piece.height / 2
          };
        }
      }
      return piece;
    }));

    setDraggedPiece(null);
  };

  const resetPuzzle = () => {
    setPieces(prev => prev.map(piece => ({
      ...piece,
      currentX: Math.random() * 200 + 350,
      currentY: Math.random() * 200 + 50,
      isPlaced: false
    })));
    setCompletedPieces(0);
    setTimeElapsed(0);
    setGameStarted(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Game Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <Trophy size={16} />
            <span>Pieces: {completedPieces}/{level.content.pieces}</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <span>Time: {formatTime(timeElapsed)}</span>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          icon={showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
        >
          {showPreview ? 'Hide' : 'Show'} Preview
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={resetPuzzle}
          icon={<RotateCcw size={16} />}
        >
          Reset
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-white/70 text-sm mb-2">
          <span>Progress</span>
          <span>{Math.round((completedPieces / level.content.pieces) * 100)}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <motion.div 
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedPieces / level.content.pieces) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Puzzle Area */}
        <div className="space-y-4">
          <h3 className="text-xl font-dancing text-white text-center">
            Puzzle Area
          </h3>
          
          <div className="relative bg-white/5 rounded-2xl p-4 border border-white/20">
            <div
              ref={puzzleRef}
              className="relative mx-auto bg-white/10 border-2 border-dashed border-white/30 rounded-xl"
              style={{ width: 300, height: 300 }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {/* Puzzle Grid Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {Array.from({ length: gridSize - 1 }).map((_, i) => (
                  <g key={i}>
                    <line
                      x1={pieceSize * (i + 1)}
                      y1={0}
                      x2={pieceSize * (i + 1)}
                      y2={300}
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                    />
                    <line
                      x1={0}
                      y1={pieceSize * (i + 1)}
                      x2={300}
                      y2={pieceSize * (i + 1)}
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                    />
                  </g>
                ))}
              </svg>

              {/* Placed Pieces */}
              {pieces.filter(piece => piece.isPlaced).map(piece => (
                <motion.div
                  key={piece.id}
                  className="absolute border border-white/30 rounded-lg overflow-hidden"
                  style={{
                    left: piece.currentX,
                    top: piece.currentY,
                    width: piece.width,
                    height: piece.height,
                    backgroundImage: `url(/images/photos/puzzle-photo.jpg)`,
                    backgroundSize: '300px 300px',
                    backgroundPosition: piece.backgroundPosition
                  }}
                  initial={{ scale: 1.2, rotate: 5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, ease: "backOut" }}
                >
                  <motion.div
                    className="absolute inset-0 bg-green-400/20 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="text-green-400 text-xl">✓</div>
                  </motion.div>
                </motion.div>
              ))}

              {/* Drop Zone Hints */}
              {pieces.filter(piece => !piece.isPlaced).map(piece => (
                <div
                  key={`hint-${piece.id}`}
                  className="absolute border border-white/20 bg-white/5 rounded-lg flex items-center justify-center text-white/40 text-xs"
                  style={{
                    left: piece.correctX,
                    top: piece.correctY,
                    width: piece.width,
                    height: piece.height
                  }}
                >
                  {piece.id + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pieces Area */}
        <div className="space-y-4">
          <h3 className="text-xl font-dancing text-white text-center">
            Puzzle Pieces
          </h3>
          
          <div className="bg-white/5 rounded-2xl p-4 border border-white/20 min-h-[300px] relative">
            {/* Preview Image */}
            <AnimatePresence>
              {showPreview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-4 right-4 z-10"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-white/30">
                    <div 
                      className="w-full h-full"
                      style={{
                        backgroundImage: `url(/images/photos/puzzle-photo.jpg)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">Preview</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loose Pieces */}
            {pieces.filter(piece => !piece.isPlaced).map(piece => (
              <motion.div
                key={piece.id}
                className="absolute border border-white/30 rounded-lg overflow-hidden cursor-move shadow-lg hover:shadow-xl transition-shadow"
                style={{
                  left: piece.currentX - 350, // Adjust for pieces area
                  top: piece.currentY - 50,
                  width: piece.width,
                  height: piece.height,
                  backgroundImage: `url(/images/photos/puzzle-photo.jpg)`,
                  backgroundSize: '300px 300px',
                  backgroundPosition: piece.backgroundPosition
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, piece)}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                whileDrag={{ scale: 1.1, zIndex: 20 }}
                initial={{ scale: 0, rotate: Math.random() * 360 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: piece.id * 0.1, duration: 0.5, ease: "backOut" }}
              >
                {/* Piece Number */}
                <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                  {piece.id + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      {!gameStarted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
        >
          <h3 className="text-lg font-dancing text-white mb-3">
            How to Play 🧩
          </h3>
          <p className="text-white/80 mb-4">
            Drag the puzzle pieces from the right side to the correct positions in the puzzle area on the left.
          </p>
          <p className="text-white/70 text-sm">
            The pieces will snap into place when you drop them in the right spot!
          </p>
        </motion.div>
      )}

      {/* Completion Celebration */}
      {completedPieces === level.content.pieces && completedPieces > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mt-8"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-dancing text-white mb-4">
            Puzzle Complete!
          </h3>
          <p className="text-white/90 text-lg">
            You completed the puzzle in {formatTime(timeElapsed)}! 
            Just like this puzzle, we're perfect when we're together! 💕
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default JigsawLevel;