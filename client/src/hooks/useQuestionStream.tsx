import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient"

export function useQuestionStream() {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [requesting, setRequesting] = useState<boolean>(false);

  const requestNewQuestion = async () => {
    setRequesting(true);
    try {
      const res = await supabase.functions.invoke("generate-new-question");
      if (res.error) {
        console.error("Function invocation failed:", res.error);
        return false;
      }

      if (res.data && res.data.ok === false) {
        console.error("Backend returned error:", res.data);
        return false;
      }

      return { ok: true };    
    } catch(e) {
      console.error("Request failed:", e);
      return false;
    } finally {
      setRequesting(false);
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel("trivia-room")
      .on("broadcast", { event: "new_question" }, (payload) => {
        setQuestion(payload.payload);
        setLoading(false);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); }
  }, []);

  useEffect(() => {
    requestNewQuestion();
  }, []);

  return {
    question,
    loading,
    requesting,
    requestNewQuestion
  };
}
