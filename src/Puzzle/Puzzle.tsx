import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { puzzleStateAtom, moveCountAtom, userImageAtom } from "../atom/atom";
import { resizeImage } from "./util";

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
  const [moveCount, setMoveCount] = useState(0);
  const [userImage, setUserImage] = useState(null);

  const [originalPuzzleState, setOriginalPuzzleState] = useState<
    number[][] | null
  >(null);
  const [blockWidth, setBlockWidth] = useState<number>(0);
  const [blockHeight, setBlockHeight] = useState<number>(0);

  useEffect(() => {
    resetPuzzle();
  }, []);

  const resetPuzzle = () => {
    setPuzzleState(originalPuzzleState);
    //   setOriginalPuzzleState(initialState);
    setMoveCount(0);
  };

  const shufflePuzzle = () => {
    const flattenedPuzzle = puzzleState.flat();
    let inversions = 0;
    flattenedPuzzle[8] = null;
    // 인버전 개수 계산
    for (let i = 0; i < flattenedPuzzle.length; i++) {
      for (let j = i + 1; j < flattenedPuzzle.length; j++) {
        if (
          flattenedPuzzle[i] &&
          flattenedPuzzle[j] &&
          flattenedPuzzle[i] > flattenedPuzzle[j]
        ) {
          inversions++;
        }
      }
    }

    // 인버전 개수가 홀수인 경우만 셔플 수행
    if (inversions % 2 === 1) {
      while (true) {
        // Fisher-Yates 알고리즘을 사용한 무작위 셔플
        for (let i = flattenedPuzzle.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [flattenedPuzzle[i], flattenedPuzzle[j]] = [
            flattenedPuzzle[j],
            flattenedPuzzle[i],
          ];
        }

        // 공란과 마지막 블록 교환
        const emptyIndex = flattenedPuzzle.indexOf(null);
        [
          flattenedPuzzle[emptyIndex],
          flattenedPuzzle[flattenedPuzzle.length - 1],
        ] = [
          flattenedPuzzle[flattenedPuzzle.length - 1],
          flattenedPuzzle[emptyIndex],
        ];

        // 인버전 개수 다시 계산
        inversions = 0;
        for (let i = 0; i < flattenedPuzzle.length; i++) {
          for (let j = i + 1; j < flattenedPuzzle.length; j++) {
            if (
              flattenedPuzzle[i] &&
              flattenedPuzzle[j] &&
              flattenedPuzzle[i] > flattenedPuzzle[j]
            ) {
              inversions++;
            }
          }
        }

        // 인버전 개수가 홀수인 경우에만 종료
        if (inversions % 2 === 1) {
          break;
        }
      }
    }

    // 셔플된 퍼즐 배열 반환
    const shuffledPuzzle = [
      flattenedPuzzle.slice(0, 3),
      flattenedPuzzle.slice(3, 6),
      flattenedPuzzle.slice(6),
    ];

    setPuzzleState(shuffledPuzzle);
    setOriginalPuzzleState(shuffledPuzzle);
    setMoveCount(0);
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
        console.log({initialState})
        setPuzzleState(initialState);
        setMoveCount(0);
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
    const { row: emptyRow, col: emptyCol } = findEmptyPiece();

    if (canMovePiece(row, col)) {
      const newState = puzzleState.map((row) => [...row]);
      newState[emptyRow][emptyCol] = newState[row][col];
      newState[row][col] = null;
      setPuzzleState(newState);
      setMoveCount(moveCount + 1);
    }
  };

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
      {userImage ? (
        <>
          {renderPuzzle()}
          <button onClick={shufflePuzzle}>셔플</button>
          <button onClick={resetPuzzle}>리셋</button>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </>
      ) : (
        <>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </>
      )}
    </PuzzleContainer>
  );
};

export default Puzzle;
