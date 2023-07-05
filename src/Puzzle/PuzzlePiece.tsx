import React from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import {
  blockHeightAtom,
  blockWidthAtom,
  initialStateAtom,
  isCompletedAtom,
  isMoveAtom,
  moveCountAtom,
  puzzleStateAtom,
} from "../atom/atom";
import { findEmptyPiece, canMovePiece, checkCompletion } from "./util";

interface PuzzlePieceCssProps {
  width: number;
  height: number;
  canMove: boolean;
}

const Piece = styled.div<PuzzlePieceCssProps>`
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
  rowIndex: number;
  colIndex: number;
  piece:string|number|null
}

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({rowIndex, colIndex, piece}) => {
  const [puzzleState, setPuzzleState] = useRecoilState(puzzleStateAtom);
  const [initialState, ] = useRecoilState(initialStateAtom);
  const [moveCount, setMoveCount] = useRecoilState(moveCountAtom);
  const [isMove, ] = useRecoilState(isMoveAtom);
  const [blockWidth, ] = useRecoilState(blockWidthAtom);
  const [blockHeight, ] = useRecoilState(blockHeightAtom);
  const [isCompleted, setIsCompleted] = useRecoilState(isCompletedAtom);
  

  const movePiece = (row: number, col: number) => {
    const { row: emptyRow, col: emptyCol } = findEmptyPiece(puzzleState);
    console.log({isMove})
    console.log({row},{col},{ emptyRow},{emptyCol})
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
      const isEqual = checkCompletion(newState, initialState);
      setIsCompleted(isEqual);
    }
  };

  return (
    <Piece
      width={blockWidth}
      height={blockHeight} 
      canMove={canMovePiece(rowIndex, colIndex, puzzleState)}
      onClick={() => movePiece(rowIndex, colIndex)}
    >
      {piece && <img src={piece as string} alt={`Piece ${piece}`} />}
    </Piece>
  );
};

export default PuzzlePiece;
