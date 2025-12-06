import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "src/pages/Index";
import NotFound from "src/pages/NotFound";
import QuizPage from "src/pages/QuizPage";
import { ScoreProvider } from "src/context/ScoreContext";

const App = () => (
  <ScoreProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/play" element={<QuizPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </ScoreProvider>
);

export default App;
