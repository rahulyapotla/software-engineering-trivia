import { useNavigate } from "react-router-dom";
import HeroTitle from "src/components/HeroTitle";
import { Button } from "src/components/Button";
import Scoreboard from "src/components/Scoreboard";
import { useScore } from "src/context/ScoreContext";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { totalScore, setTotalScore } = useScore();
 
  const handleStartQuiz = () => {
    setTotalScore(0);
    navigate("/play");
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="relative z-10 flex flex-col items-center gap-12">
        <HeroTitle />
        <Button
          variant="primary"
          size="lg"
          iconRight={<ArrowRight className="w-5 h-5 ml-2" />}
          onClick={handleStartQuiz}
        >
          Start Quiz
        </Button>
        <Scoreboard score={totalScore} />
      </div>
    </main>
  );
};

export default Index;



