export const resizeImage = (image: string | ArrayBuffer | null, maxWidth: number, maxHeight: number) => {
  return new Promise<string | null>((resolve) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;
      context?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL());
    };
    img.src = image as string;
  });
};

export const shuffleImage = (flattenedPuzzle:(number | null)[]) => {
  const piece = flattenedPuzzle.map((p, index) => ({
    index: index,
    image: p,
  }));
  let inversions = 0;

  let emptyIndex = piece.findIndex(
    (p) => p?.image === undefined || p === undefined
  );
  if (emptyIndex === -1) {
  }
  {
    [piece[emptyIndex], piece[flattenedPuzzle.length - 1]] = [
      piece[flattenedPuzzle.length - 1],
      piece[emptyIndex],
    ];
  }

  while (true) {
    // Fisher-Yates 알고리즘을 사용한 무작위 셔플
    for (let i = piece.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [piece[i], piece[j]] = [piece[j], piece[i]];
    }
    // 인버전 개수 다시 계산
    inversions = 0;
    for (let i = 0; i < piece.length; i++) {
      for (let j = i + 1; j < piece.length; j++) {
        if (
          piece[i]?.index &&
          piece[j]?.index &&
          piece[i]?.index > piece[j]?.index
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

  const newArr = piece.map((p) => p?.image);
  // 셔플된 퍼즐 배열 반환
  const shuffledPuzzle = [
    newArr.slice(0, 3),
    newArr.slice(3, 6),
    newArr.slice(6),
  ];
  return shuffledPuzzle
}

export const checkCompletion = (currentState: (number|null)[][], initialState:(number|null)[][]) => {
  const currentPuzzle = currentState.flat().slice(0, -1)
  const initialPuzzle = initialState.flat().slice(0, -1)
  const isEqual =
    JSON.stringify(currentPuzzle) === JSON.stringify(initialPuzzle);
  return isEqual
};

export const findEmptyPiece = (puzzleState:(number | null)[][]) => {
  for (let i = 0; i < puzzleState?.length; i++) {
    for (let j = 0; j < puzzleState[i].length; j++) {
      if (puzzleState[i][j] === null || puzzleState[i][j] === undefined) {
        return { row: i, col: j };
      }
    }
  }
  return { row: -1, col: -1 };
};
export const canMovePiece = (row: number, col: number, puzzleState:(number | null)[][]) => {
  const { row: emptyRow, col: emptyCol } = findEmptyPiece(puzzleState);
  return (
    (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
    (col === emptyCol && Math.abs(row - emptyRow) === 1)
  );
};