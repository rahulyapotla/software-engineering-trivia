import { useState } from "react";
import { supabase } from "../lib/supabaseClient"

export function useAnswer() {
  const [requesting, setRequesting] = useState<boolean>(false);
  const submitAnswer = async (questionObj, selected, totalScore) => {
    setRequesting(true);
    try {
      const res = await supabase.functions.invoke(
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
      if (res.error) {
        console.error("Function invocation failed:", res.error);
        return false;
      }

      if (res.data && res.data.ok === false) {
        console.error("Backend returned error:", res.data);
        return false;
      }

      return true;
    } catch(err) {
      console.error("Failed to submit answer", err);
      return false;
    } finally {
      setRequesting(false);
    }
  };

  return { requesting, submitAnswer };
}

