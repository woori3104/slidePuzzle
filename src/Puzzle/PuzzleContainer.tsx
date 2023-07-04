import React, { useState } from "react";
import styled from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  isCompletedState,
  isMoveState,
  moveCountAtom,
  originalPuzzleStateSelector,
  puzzleStateAtom,
} from "../atom/atom";
import { resizeImage, shuffledImage } from "./util";
import { RenderPuzzle } from "./RenderPuzzle";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.button`
  margin: 10px;
`;
const UploadButton = styled.input`
  margin-top: 10px;
`;


const PuzzleContainer: React.FC = () => {
  const [puzzleState, setPuzzleState] = useRecoilState(puzzleStateAtom);
  const [moveCount, setMoveCount] = useRecoilState(moveCountAtom);
 const [isCompleted, setIsCompleted] = useRecoilState(isCompletedState);
  const [, setIsMove] = useRecoilState(isMoveState);
  const [blockWidth, setBlockWidth] = useState<number>(0);
  const [blockHeight, setBlockHeight] = useState<number>(0);
  const [isChallengeStarted, setIsChallengeStarted] = useState(false);
  const [originalPuzzleState, setOriginalPuzzleState] = useState(originalPuzzleStateSelector);


  const [userImage, setUserImage] = useState(null);
  const shufflePuzzle = () => {
    const shuffledPuzzle = shuffledImage(puzzleState);
    setIsMove(true);
    setPuzzleState(shuffledPuzzle);
    setMoveCount(0);
    setIsCompleted(false);
  };

  const resetPuzzle = () => {
    setPuzzleState(originalPuzzleState);
    setMoveCount(0);
    setIsCompleted(false);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
        const initialState = pieces?.reduce(
          (state: (number|null)[][], piece?: { index: number, dataUrl?: string}) => {
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
        setPuzzleState(initialState);
        setMoveCount(0);
        setOriginalPuzzleState(initialState);

        setIsCompleted(false);
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
  return (
    <Container>
      <div>이동 횟수: {moveCount}</div>
      {puzzleState ? (
        <>
          {puzzleState.map((row, rowIndex) => (
            <PuzzleRow key={rowIndex} row={row} />
          ))}
          <button onClick={shufflePuzzle}>셔플</button>
          <button onClick={resetPuzzle}>리셋</button>
          {isCompleted ? <div>완료</div> : isMove && <div>도전 중...</div>}
        </>
      ) : (
        <UploadButton
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
      )}
    </Container>
  );
};

export default PuzzleContainer;