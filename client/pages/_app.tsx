import '../styles/global.css';
import '../styles/responsive.css';
import { ResultCheckProvider } from '../contexts/CheckProvider';
import Game from './game';

export default function App() {
  return (
    <>
      <ResultCheckProvider>
        <Game />
      </ResultCheckProvider>
    </>
  );
}
