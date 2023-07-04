import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { canMovePiece, checkCompletion, findEmptyPiece, resizeImage, shuffleImage } from "./util";

const PuzzleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PuzzleRow = styled.div`
  display: flex;
`;

interface PuzzlePieceProps {
  width: number;
  height: number;
  canMove: boolean;
}

const PuzzlePiece = styled.div<PuzzlePieceProps>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  cursor: ${({ canMove }) => (canMove ? "pointer" : "default")};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Puzzle: React.FC = () => {
  const [puzzleState, setPuzzleState] = useState([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, null],
  ]);
  const [initialState, setInitialState] = useState([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, null],
  ]);
  const [moveCount, setMoveCount] = useState(0);
  const [userImage, setUserImage] = useState(null);
  const [isMove, setIsMove] = useState(false);
  const [originalPuzzleState, setOriginalPuzzleState] = useState<
    (number|null)[][]
  >([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, null],
  ]);
  const [blockWidth, setBlockWidth] = useState<number>(0);
  const [blockHeight, setBlockHeight] = useState<number>(0);
  const [isChallengeStarted, setIsChallengeStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const startChallenge = () => {
    setIsChallengeStarted(true);
  };
  useEffect(() => {
    resetPuzzle();
  }, []);

  const resetPuzzle = () => {
    setPuzzleState(originalPuzzleState);
    //   setOriginalPuzzleState(initialState);
    setMoveCount(0);

    setIsChallengeStarted(false);
    setIsCompleted(false);
  };

  const shufflePuzzle = () => {
    setIsMove(true);
    const flattenedPuzzle = initialState.flat();
    const shuffledPuzzle = shuffleImage(flattenedPuzzle)
    setPuzzleState(shuffledPuzzle);
    setOriginalPuzzleState(shuffledPuzzle);
    setMoveCount(0);
    setIsCompleted(false);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsMove(false);
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const resizedImage = await resizeImage(
          reader.result as string,
          500,
          500
        );
        setUserImage(resizedImage);

        const pieces = await splitImage(resizedImage);
        const initialValue = pieces?.reduce(
          (state: number[][], piece: { index: number; dataUrl: string }) => {
            const { index, dataUrl } = piece;
            const row = Math.floor((index - 1) / 3);
            const col = (index - 1) % 3;
            state[row][col] = dataUrl;
            return state;
          },
          [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, null],
          ]
        );
        setPuzzleState(initialValue);
        setMoveCount(0);

        setOriginalPuzzleState(initialValue);
        setInitialState(initialValue)
        setIsCompleted(false);
        console.log({initialValue})
      };
      reader.readAsDataURL(file);
    }
  };

  const splitImage = async (image: string | null) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const imageObj = new Image();

    return new Promise<{ index: number; dataUrl: string }[]>((resolve) => {
      imageObj.onload = () => {
        const pieceWidth = imageObj.width / 3;
        const pieceHeight = imageObj.height / 3;
        setBlockWidth(pieceWidth);
        setBlockHeight(pieceHeight);

        const pieces: { index: number; dataUrl: string }[] = [];

        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            canvas.width = pieceWidth;
            canvas.height = pieceHeight;
            context?.drawImage(
              imageObj,
              col * pieceWidth,
              row * pieceHeight,
              pieceWidth,
              pieceHeight,
              0,
              0,
              pieceWidth,
              pieceHeight
            );

            const pieceDataUrl = canvas.toDataURL();
            const pieceIndex = row * 3 + col + 1;
            pieces.push({
              index: pieceIndex,
              dataUrl: pieceDataUrl,
            });
          }
        }
        resolve(pieces);
      };

      imageObj.src = image as string;
    });
  };

  const movePiece = (row: number, col: number) => {
    const { row: emptyRow, col: emptyCol } = findEmptyPiece(puzzleState);
    if (
      isMove &&
      canMovePiece(row, col, puzzleState) &&
      (emptyRow !== row || emptyCol !== col) &&
      !isCompleted
    ) {
      const newState = puzzleState.map((row) => [...row]);
      newState[emptyRow][emptyCol] = newState[row][col];
      newState[row][col] = null;
      setPuzzleState(newState);
      setMoveCount(moveCount + 1);
      // 
      const isEqual = checkCompletion(newState, initialState);
      setIsCompleted(isEqual);
    }
  };

  const renderPuzzle = () => {
    if (!puzzleState) {
      return null;
    }
    return puzzleState.map((row, rowIndex) => (
      <PuzzleRow key={rowIndex}>
        {row.map((piece, colIndex) => (
          <PuzzlePiece
            key={colIndex}
            width={blockWidth}
            height={blockHeight}
            canMove={canMovePiece(rowIndex, colIndex)}
            onClick={() => movePiece(rowIndex, colIndex)}
          >
            {piece && <img src={piece} alt={`Piece ${piece}`} />}
          </PuzzlePiece>
        ))}
      </PuzzleRow>
    ));
  };

  return (
    <PuzzleContainer>
      <div>이동 횟수: {moveCount}</div>

      {!userImage && <div>이미지를 선택해주세요</div>}
      {userImage ? (
        <>
          {renderPuzzle()}
          <button onClick={shufflePuzzle}>셔플</button>
          <button onClick={resetPuzzle}>리셋</button>
          <>{isCompleted ? <div>완료</div> : isMove && <div>도전 중...</div>}</>
        </>
      ) : (
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      )}
      {!isChallengeStarted && userImage && (
        <>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </>
      )}
    </PuzzleContainer>
  );
};

export default Puzzle;
