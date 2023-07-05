import React from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import {
  blockHeightAtom,
  blockWidthAtom,
  initialStateAtom,
  isCompletedAtom,
  moveCountAtom,
  originalPuzzleStateAtom,
  puzzleStateAtom,
  userImageAtom,
} from "../atom/atom";
import { resizeImage } from "./util";

const UploadButton = styled.input`
  margin-top: 10px;
  margin-bottom:10px;
`;

const PuzzleUploader: React.FC = () => {
  const [, setPuzzleState] = useRecoilState(puzzleStateAtom);
  const [, setInitialState] = useRecoilState(initialStateAtom);
  const [, setMoveCount] = useRecoilState(moveCountAtom);
  const [userImage, setUserImage] = useRecoilState(userImageAtom);
  const [, setOriginalPuzzleState] = useRecoilState(originalPuzzleStateAtom);
  const [, setBlockWidth] = useRecoilState(blockWidthAtom);
  const [, setBlockHeight] = useRecoilState(blockHeightAtom);

  const [, setIsCompleted] = useRecoilState(isCompletedAtom);

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

  return (
    <>
      {!userImage && <div>이미지를 선택해주세요</div>}
      {userImage ? (
        <UploadButton
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
      ) : (
        <UploadButton
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
      )}
    </>
  );
};

export default PuzzleUploader;
