import { useRecoilState } from "recoil";
import { puzzleStateAtom } from "../atom/atom";
import PuzzleRow from "./PuzzleRow";
const RenderPuzzle: React.FC = () => {
    const [puzzleState] = useRecoilState(puzzleStateAtom);
  
    return (
      <>
        {puzzleState?.map((row, rowIndex) => (
          <PuzzleRow key={rowIndex} row={row} rowIndex={rowIndex} />
        ))}
      </>
    );
  };
  

  export default RenderPuzzle;