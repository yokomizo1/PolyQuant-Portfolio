import { Wallet, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center glow-border">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <span className="text-lg font-semibold font-mono tracking-tight text-foreground">
          Poly<span className="text-neon">Quant</span> Bot
        </span>
      </div>
      <Button variant="neon-outline" size="sm" className="font-mono text-xs">
        <Wallet className="w-3.5 h-3.5 mr-1.5" />
        Connect Wallet
      </Button>
    </header>
  );
};

export default Header;
