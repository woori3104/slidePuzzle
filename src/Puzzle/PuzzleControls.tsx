import React from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import {
  isChallengeStartedAtom,
  isCompletedAtom,
  moveCountAtom,
  originalPuzzleStateAtom,
  puzzleStateAtom,
  isMoveAtom
} from "../atom/atom";
import { shuffleImage } from "./util";

const Button = styled.button`
  margin: 10px;
`;

const PuzzleControls: React.FC = () => {
  const [, setPuzzleState] = useRecoilState(puzzleStateAtom);
  const [, setMoveCount] = useRecoilState(moveCountAtom);
  const [originalPuzzleState, ] = useRecoilState(
    originalPuzzleStateAtom
  );
  const [, setIsMove] = useRecoilState(isMoveAtom);
  
  const [isChallengeStarted, setIsChallengeStarted] = useRecoilState(
    isChallengeStartedAtom
  );
  const [isCompleted, setIsCompleted] = useRecoilState(isCompletedAtom);

  const resetPuzzle = () => {
    setPuzzleState(originalPuzzleState);
    setMoveCount(0);
    setIsChallengeStarted(false);
    setIsCompleted(false);
    setIsMove(false);
  };

  const shufflePuzzle = () => {
    setIsChallengeStarted(true);
    const flattenedPuzzle = originalPuzzleState.flat();
    const shuffledPuzzle = shuffleImage(flattenedPuzzle);
    setPuzzleState(shuffledPuzzle);
    setMoveCount(0);
    setIsMove(true);
    setIsCompleted(false);
  };

  return (
    <>
      <Button onClick={shufflePuzzle}>셔플</Button>
      <Button onClick={resetPuzzle}>리셋</Button>
      {isCompleted ? <div>완료</div> : isChallengeStarted && <div>도전 중...</div>}
    </>
  );
};

export default PuzzleControls;
