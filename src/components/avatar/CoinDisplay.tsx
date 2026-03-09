interface CoinDisplayProps {
  coins: number;
  size?: "sm" | "md" | "lg";
}

const CoinDisplay = ({ coins, size = "md" }: CoinDisplayProps) => {
  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs gap-1",
    md: "px-4 py-2 text-sm gap-1.5",
    lg: "px-5 py-2.5 text-lg gap-2",
  };

  const iconSize = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div
      className={`inline-flex items-center ${sizeClasses[size]} rounded-full font-bold
        bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500
        text-white shadow-lg shadow-amber-400/30
        border-2 border-yellow-300/50
        animate-coin-glow`}
    >
      <span className={`${iconSize[size]} animate-coin-spin`}>🪙</span>
      <span className="drop-shadow-md tracking-wide">{coins.toLocaleString()}</span>
    </div>
  );
};

export default CoinDisplay;
