import React, { useState } from "react";
import styled from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  blockHeightAtom,
  blockWidthAtom,
  initialStateAtom,
  isChallengeStartedAtom,
  isCompletedAtom,
  isMoveAtom,
  moveCountAtom,
  originalPuzzleStateAtom,
  puzzleStateAtom,
  userImageAtom,
} from "../atom/atom";
import { canMovePiece, checkCompletion, findEmptyPiece, resizeImage, shuffleImage } from "./util";
import RenderPuzzle from "./RenderPuzzle";



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


export const PuzzleContainer: React.FC = () => {

  const [puzzleState, setPuzzleState] = useRecoilState(puzzleStateAtom);
  const [initialState, setInitialState] = useRecoilState(initialStateAtom);
  const [moveCount, setMoveCount] = useRecoilState(moveCountAtom);
  const [userImage, setUserImage] = useRecoilState(userImageAtom);
  const [isMove, setIsMove] = useRecoilState(isMoveAtom);
  const [originalPuzzleState, setOriginalPuzzleState] = useRecoilState(originalPuzzleStateAtom);
  const [blockWidth, setBlockWidth] = useRecoilState(blockWidthAtom);
  const [blockHeight, setBlockHeight] = useRecoilState(blockHeightAtom);
  const [isChallengeStarted, setIsChallengeStarted] = useRecoilState(isChallengeStartedAtom);
  const [isCompleted, setIsCompleted] = useRecoilState(isCompletedAtom);
  

  const resetPuzzle = () => {
    setPuzzleState(originalPuzzleState);
    setMoveCount(0);
    setIsChallengeStarted(false);
    setIsCompleted(false);
  };

  const shufflePuzzle = () => {
    setIsMove(true);
    const flattenedPuzzle = initialState.flat();
    const shuffledPuzzle = shuffleImage(flattenedPuzzle);
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
        setUserImage(resizedImage as React.SetStateAction<null>);

        const pieces = await splitImage(resizedImage);
        const initialValue = pieces?.reduce(
          (
            state: (number | null | string)[][],
            piece: { index: number; dataUrl: string }
          ) => {
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
        setInitialState(initialValue);
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
      {!userImage && <div>이미지를 선택해주세요</div>}
      {userImage ? (
        <>
          <RenderPuzzle/>
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
    </Container>
  );
};

export default PuzzleContainer;