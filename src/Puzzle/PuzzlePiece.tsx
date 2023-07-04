import React from "react";
import styled from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isMoveState,
  moveCountAtom,
  originalPuzzleStateSelector,
} from "../atom/atom";

const Piece = styled.div`
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

interface PuzzlePieceProps {
  width: number;
  height: number;
  canMove: boolean;
  piece: number;
}

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({
  width,
  height,
  canMove,
  piece,
}) => {
  const [puzzleState, setPuzzleState] = useRecoilState(puzzleStateAtom);
  const isMove = useRecoilValue(isMoveState);
  const [moveCount, setMoveCount] = useRecoilState(moveCountAtom);
  const originalPuzzleState = useRecoilValue(originalPuzzleStateSelector);

  const findEmptyPiece = () => {
    for (let i = 0; i < puzzleState.length; i++) {
      for (let j = 0; j < puzzleState[i].length; j++) {
        if (puzzleState[i][j] === null || puzzleState[i][j] === undefined) {
          return { row: i, col: j };
        }
      }
    }
    return { row: -1, col: -1 };
  };

  const canMovePiece = (row: number, col: number) => {
    const { row: emptyRow, col: emptyCol } = findEmptyPiece();
    return (
      (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
      (col === emptyCol && Math.abs(row - emptyRow) === 1)
    );
  };


  const checkCompletion = (currentState: number[][]) => {
    const isEqual =
      JSON.stringify(currentState) === JSON.stringify(originalPuzzleState);
    setIsCompleted(isEqual);
  };


  const movePiece = (row: number, col: number) => {
    const { row: emptyRow, col: emptyCol } = findEmptyPiece();
    console.log({emptyRow}, {emptyCol},{col},{row})
    if (isMove && canMovePiece(row, col) && (emptyRow!==row || emptyCol!==col)) {
      const newState = puzzleState.map((row) => [...row]);
      newState[emptyRow][emptyCol] = newState[row][col];
      newState[row][col] = null;
      setPuzzleState(newState);
      setMoveCount(moveCount + 1);ß
      checkCompletion(newState);
    }
  };

  return (
    <Piece
      width={width}
      height={height}
      canMove={canMove}
      onClick={movePiece}
    >
      {piece && <img src={piece} alt={`Piece ${piece}`} />}
    </Piece>
  );
};

export default PuzzlePiece;
