import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Scoreboard from "src/components/Scoreboard";
import { useQuestionStream } from "src/hooks/useQuestionStream";
import { useAnswer } from "src/hooks/useAnswerHook";
import { Button } from "src/components/Button";
import { RadioGroup } from "src/components/RadioGroup";
import { RadioGroupItem } from "src/components/RadioGroupItem";
import { useScore } from "src/context/ScoreContext";
import AnswerFeedback from "src/components/AnswerFeedback";

export default function QuizPage() {
  const navigate = useNavigate();
  const { question, loading, requestNewQuestion } =
    useQuestionStream();
  const { submitAnswer } = useAnswer();
  const { totalScore, explanation, isCorrect, resetFeedback } = useScore();
  const [selected, setSelected] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleNext = async () => {
    await requestNewQuestion();
    setSubmitted(false);
    setSelected("");
    resetFeedback();
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    await submitAnswer(question, selected, totalScore);
  };

  if (loading || !question) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Waiting for question…</p>
      </main>
    );
  }

  return (
    <main className="bg-gray-100 relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-5xl">
        <div className="w-full flex items-center flex-wrap gap-4 justify-between">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate("/")}
            iconLeft={<i className="fa-solid fa-house text-2xl"></i>}
          >
            Home
          </Button>
          <Scoreboard score={totalScore} />
        </div>

        {explanation
          && (
            <div className="w-full backdrop-blur-sm border-white hover:border-primary rounded-2xl p-8 bg-primary">
              <h2
                id="question-label"
                className="text-small font-small mb-8 text-white"
              >
                {explanation}
              </h2>
            </div>
          )
        }

        <div className="QuestionCard w-full backdrop-blur-sm border-white hover:border-primary rounded-2xl p-4 bg-primary" style={{ backgroundColor: "#192028"}}>
          <h2
            id="question-label"
            className="text-sm sm:text-lg text-start font-semibold my-4 sm:m-[20px] text-white"
          >
            {question.question}
          </h2>

          <RadioGroup
            value={selected}
            onValueChange={setSelected}
            ariaLabelledBy="question-label"
            required
            className="space-y-4 w-auto pb-4 sm:px-[20px]"
          >
            {question.options.map((opt, idx) => (
              <RadioGroupItem 
                key={opt} 
                value={opt} 
                checked={selected === opt} 
                disabled={submitted}
              >
                {opt}
              </RadioGroupItem>
            ))}
          </RadioGroup>

          {selected && (
            <Button
              variant="secondary"
              size="lg"
              onClick={handleSubmit}
              disabled={!selected || submitted}
              className="hover:bg-white hover:text-primary"
            >
              Submit
            </Button>
          )}
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleNext}
          disabled={!submitted}
          iconRight={<i className="fa-solid fa-arrow-right ml-2"></i>}
          className="sm:ml-auto"
        >
          Next Question
        </Button>

        <AnswerFeedback isCorrect={isCorrect} />
      </div>
    </main>
  );
}


