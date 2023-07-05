import { atom } from 'recoil';

// 상태를 나타내는 atom 정의
export const puzzleStateAtom = atom<(number | null | string)[][]>({
  key: 'puzzleState',
  default: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, null],
  ],
});

export const initialStateAtom = atom<(number | null | string)[][]>({
  key: 'initialState',
  default: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, null],
  ],
});

export const moveCountAtom = atom<number>({
  key: 'moveCount',
  default: 0,
});

export const userImageAtom = atom<React.SetStateAction<null>>({
  key: 'userImage',
  default: null,
});

export const isMoveAtom = atom<boolean>({
  key: 'isMove',
  default: false,
});

export const originalPuzzleStateAtom = atom<(number | null | string)[][]>({
  key: 'originalPuzzleState',
  default: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, null],
  ],
});

export const blockWidthAtom = atom<number>({
  key: 'blockWidth',
  default: 0,
});

export const blockHeightAtom = atom<number>({
  key: 'blockHeight',
  default: 0,
});

export const isChallengeStartedAtom = atom<boolean>({
  key: 'isChallengeStarted',
  default: false,
});

export const isCompletedAtom = atom<boolean>({
  key: 'isCompleted',
  default: false,
});


