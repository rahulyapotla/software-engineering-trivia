import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "src/lib/supabaseClient";

const ScoreContext = createContext(null);

export function ScoreProvider({ children }) {
  const [totalScore, setTotalScore] = useState<number>(0);
  const [explanation, setExplanation] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean>(null);

  useEffect(() => {
    const channel = supabase
      .channel("score")
      .on("broadcast", { event: "score_update" }, ({ payload }) => {
        setTotalScore(payload.totalScore);
        setExplanation(payload.explanation);
        setIsCorrect(payload.is_correct);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const resetFeedback = () => {
    setExplanation('');
    setIsCorrect(null);
  }

  return (
    <ScoreContext.Provider
      value={{
        totalScore,
        explanation,
        isCorrect,
        setTotalScore,
        resetFeedback,
      }}
    >
      {children}
    </ScoreContext.Provider>
  );
}

export function useScore() {
  const ctx = useContext(ScoreContext);
  if (!ctx) {
    throw new Error("useScore must be used inside <ScoreProvider>");
  }
  return ctx;
}
