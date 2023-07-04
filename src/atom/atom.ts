import { atom, selector } from "recoil";

export const puzzleStateAtom = atom<(number | null)[][]>({
  key: "puzzleState",
  default: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, null],
  ],
});

export const moveCountAtom = atom<number>({
  key: "moveCount",
  default: 0,
});

export const originalPuzzleStateSelector = atom<(number | null)[][]>({
  key: "originalPuzzleStateSelector",
  default: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, null],
  ],
});

export const isMoveState = atom<boolean>({
  key: "isMoveState",
  default: false,
});


export const isCompletedState = atom<boolean>({
  key: "isCompletedState",
  default: false,
});

export const userImageState = atom<string | ArrayBuffer | null>({
  key: "userImageState",
  default: null,
});

