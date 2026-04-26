import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Bell,
  Settings,
  Key,
  CreditCard,
  HelpCircle,
  LogOut,
  TrendingUp,
  Newspaper,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mockNotifications = [
  {
    id: "1",
    type: "trade" as const,
    title: "Trade Executed: Won +$140",
    description: "Real Madrid vs Barcelona — Over 2.5 goals",
    time: "2m ago",
    unread: true,
  },
  {
    id: "2",
    type: "trade" as const,
    title: "Trade Executed: Won +$85",
    description: "Trump wins Iowa caucus market closed",
    time: "1h ago",
    unread: true,
  },
  {
    id: "3",
    type: "news" as const,
    title: "Fed keeps rates unchanged",
    description: "Crypto markets reacting. BTC up 2.4%.",
    time: "3h ago",
    unread: false,
  },
  {
    id: "4",
    type: "news" as const,
    title: "Polymarket volume hits ATH",
    description: "$42M in 24h volume across all markets.",
    time: "5h ago",
    unread: false,
  },
  {
    id: "5",
    type: "trade" as const,
    title: "Trade Lost: -$30",
    description: "ETH above $4k by March — expired No",
    time: "1d ago",
    unread: false,
  },
];

const DashboardNav = () => {
  const { user, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  const initials =
    user?.user_metadata?.display_name
      ?.split(" ")
      .map((w: string) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ||
    user?.email?.slice(0, 2).toUpperCase() ||
    "PQ";

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const profileMenuItems = [
    { icon: Settings, label: "Account Settings" },
    { icon: Key, label: "API Keys" },
    { icon: CreditCard, label: "Subscription" },
    { icon: HelpCircle, label: "Support" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center glow-border">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <span className="text-lg font-semibold font-mono tracking-tight text-foreground">
            Poly<span className="text-neon">Quant</span>
          </span>
        </a>

        {/* Nav Links */}
        <div className="hidden sm:flex items-center gap-1 ml-6">
          <a href="#dashboard" className="text-xs font-mono px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
            Dashboard
          </a>
          <a href="#signals" className="text-xs font-mono px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors flex items-center gap-1.5">
            <Newspaper className="w-3.5 h-3.5" /> News
          </a>
        </div>

        <div className="flex-1" />

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setProfileOpen(false);
              }}
              className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background" />
              )}
            </button>

            {/* Notification Panel */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground font-mono">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto divide-y divide-border">
                  {mockNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 flex gap-3 hover:bg-secondary/50 transition-colors cursor-pointer ${
                        n.unread ? "bg-primary/5" : ""
                      }`}
                      onClick={() => setNotifOpen(false)}
                    >
                      <div
                        className={`mt-0.5 w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                          n.type === "trade"
                            ? "bg-primary/10 text-primary"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {n.type === "trade" ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <Newspaper className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm leading-tight ${
                            n.unread
                              ? "font-semibold text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {n.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {n.description}
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1 font-mono">
                          {n.time}
                        </p>
                      </div>
                      {n.unread && (
                        <span className="mt-2 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotifOpen(false);
              }}
              className="rounded-full ring-2 ring-border hover:ring-primary/50 transition-all"
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-secondary text-foreground text-xs font-mono font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user?.user_metadata?.display_name || "PolyQuant User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
                <div className="py-1">
                  {profileMenuItems.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <span className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                    </button>
                  ))}
                </div>
                <div className="border-t border-border py-1">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      signOut();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;
