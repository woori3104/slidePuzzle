import { atom } from "recoil";

export const puzzleStateAtom = atom({
    key: "puzzleState",
    default: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, null],
    ],
  });
  
  export const moveCountAtom = atom({
    key: "moveCount",
    default: 0,
  });
  
  export const userImageAtom = atom({
    key: "userImage",
    default: null,
  });
  