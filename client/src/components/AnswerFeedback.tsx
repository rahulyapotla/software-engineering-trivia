import Confetti from "react-confetti";
import { useEffect, useState } from "react";

const AnswerFeedback = ({ isCorrect }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isCorrect) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isCorrect]);

  return (
    <>
      {show && <Confetti numberOfPieces={250} recycle={false} />}
    </>
  );
};

export default AnswerFeedback;