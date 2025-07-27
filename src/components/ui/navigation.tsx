import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code, Target, FileText, Trophy, User } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { name: "Practice", path: "https://lovable.dev/projects/06595499-5cc2-4bff-b662-93b15db64ed0", icon: Code, external: true },
    { name: "Interview", path: "/interview", icon: Target },
    { name: "Resume", path: "/resume", icon: FileText },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 mr-8">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">CrackIt</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = !item.external && location.pathname === item.path;
              
              if (item.external) {
                return (
                  <a
                    key={item.name}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </a>
                );
              }
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navigation;