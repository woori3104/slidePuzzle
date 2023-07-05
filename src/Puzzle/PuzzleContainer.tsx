import React from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import {
  isChallengeStartedAtom,
  moveCountAtom,
  userImageAtom,
} from "../atom/atom";
import PuzzleControls from "./PuzzleControls";
import PuzzleUploader from "./PuzzleUploader";
import RenderPuzzle from "./RenderPuzzle";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const PuzzleContainer: React.FC = () => {
 
  return (
    <Container>
     <PuzzleChilderen/>
    </Container>
  );
};

const PuzzleChilderen = () => {
  const [moveCount, ] = useRecoilState(moveCountAtom);
  const [userImage, ] = useRecoilState(userImageAtom);
  const [isChallengeStarted, ] = useRecoilState(
    isChallengeStartedAtom
  );
  return (
    <div>
    {isChallengeStarted && <div>이동횟수{moveCount}</div>}
    <PuzzleUploader />
    {userImage && (
      <>
        <RenderPuzzle />
        <PuzzleControls />
      </>
    )}
  </div>
  )
}

export default PuzzleContainer;
