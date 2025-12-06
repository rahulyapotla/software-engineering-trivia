import { Trophy } from "lucide-react";

interface ScoreboardProps {
  score: number;
}

const Scoreboard = ({ score }: ScoreboardProps) => {
  return (
    <div className="ScoreBoard border-2 bg-[#61ce70] border-primary/30 rounded-xl px-8 py-4 box-glow animate-pulse-glow">
      <div className="flex items-center gap-3">
        <Trophy className="w-6 h-6 text-primary" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-display">
            Score
          </span>
          <span className="text-3xl font-bold font-display text-primary text-glow">
            {score}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
