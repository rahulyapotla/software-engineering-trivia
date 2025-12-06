import { Brain, Zap } from "lucide-react";

const HeroTitle = () => {
  return (
    <div className="flex flex-col items-center gap-4 animate-float">
      <div className="flex items-center gap-4">
        <Brain className="w-12 h-12 md:w-16 md:h-16 text-primary text-glow" />
        <Zap className="w-8 h-8 md:w-10 md:h-10 text-accent text-glow-accent" />
      </div>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display text-center">
        <span className="text-white/90">AI </span>
        <span className="text-primary text-glow">Trivia</span>
        <br />
        <span className="text-accent text-white/90 text-glow-accent">Arena</span>
      </h1>
      <p className="text-white/90 text-center max-w-md mt-2" style={{fontFamily: "'Playfair Display', serif"}}>
        Test your knowledge against AI-powered questions. How high can you score?
      </p>
    </div>
  );
};

export default HeroTitle;
