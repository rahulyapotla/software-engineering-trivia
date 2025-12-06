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
import Spinner from "src/components/Spinner";
import { ArrowRight, Home } from "lucide-react";
import ErrorToast from "src/components/ErrorToast";

export default function QuizPage() {
  const navigate = useNavigate();
  const { question, loading, requesting, requestNewQuestion } =
    useQuestionStream();
  const { requesting: verifyingAnswer, submitAnswer } = useAnswer();
  const { totalScore, explanation, isCorrect, resetFeedback } = useScore();
  const [selected, setSelected] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);

  const handleNext = async () => {
    const ok = await requestNewQuestion();
    if (!ok) {
      console.error("Failed to fetch new question.");
      setErrorMessage("Failed to load new question. Please try again.");
      setShowError(true);
      return;
    }
    setErrorMessage("");
    setSubmitted(false);
    setSelected("");
    resetFeedback();
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    try {
      const ok = await submitAnswer(question, selected, totalScore);

      if (!ok) {
        throw new Error("submit failed");
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Submit failed:", err);
      setErrorMessage("Could not submit your answer. Please try again.");
      setShowError(true);
    }
  };

  if (loading || !question) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Waiting for question…</p>
        <Spinner size={60} color="#1d4ed8" />
      </main>
    );
  }

  return (
    <>
      <main className="bg-gray-100 relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-5xl">
          <div className="w-full flex items-center flex-wrap gap-4 justify-between">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate("/")}
              iconLeft={<Home className="w-4 h-4 mr-2" />}
            >
              Home
            </Button>
            <Scoreboard score={totalScore} />
          </div>

          {explanation
            && (
              <div className="w-full backdrop-blur-sm border-white hover:border-primary rounded-2xl p-8 bg-primary">
                <h2
                  id="explanation-label"
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
            iconRight={<ArrowRight className="w-5 h-5 ml-2" />}
            className="sm:ml-auto"
          >
            Next Question
          </Button>

          <AnswerFeedback isCorrect={isCorrect} />
          {(requesting || verifyingAnswer) && (
            <Spinner size={60} color="#1d4ed8" />
          )}
        </div>
      </main>
      <ErrorToast
        message={errorMessage}
        show={showError}
        onClose={() => setShowError(false)}
      />
    </>
  );
}


