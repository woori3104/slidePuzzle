import Puzzle from "./Puzzle/Puzzle"
import { RecoilRoot } from 'recoil';

function App() {

  return (
    <RecoilRoot> {/* RecoilRoot로 감싸기 */}
    <div>
      <Puzzle />
    </div>
  </RecoilRoot>
  )
}

export default App
