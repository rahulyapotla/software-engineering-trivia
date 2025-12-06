import { useState } from "react";
import { supabase } from "../lib/supabaseClient"

export function useAnswer() {
  const [requesting, setRequesting] = useState<boolean>(false);
  const submitAnswer = async (questionObj, selected, totalScore) => {
    setRequesting(true);
    try {
      await supabase.functions.invoke(
        "submit-answer",
        {
          body: JSON.stringify({
            question_id: questionObj.id, 
            question: questionObj.question, 
            options: questionObj.options, 
            chosen_index: questionObj.options.indexOf(selected),
            totalScore: totalScore || 0,
          })
        }
      );
    } finally {
      setRequesting(false);
    }
  };

  return { requesting, submitAnswer };
}

