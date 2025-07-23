import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Code2, 
  Video, 
  FileText, 
  Trophy, 
  Users, 
  Brain,
  Timer,
  CheckCircle2
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Code2,
      title: "Coding Practice Arena",
      description: "500+ problems across all difficulty levels with real-time code execution",
      badge: "Popular",
      highlights: ["Arrays, Trees, DP", "Multiple Languages", "Test Cases"]
    },
    {
      icon: Video,
      title: "Interview Simulator",
      description: "Practice with AI-powered mock interviews for technical and HR rounds",
      badge: "AI-Powered",
      highlights: ["Real-time Feedback", "Timer-based", "Record Sessions"]
    },
    {
      icon: FileText,
      title: "Resume Builder",
      description: "Professional templates and expert review to make your resume stand out",
      badge: "Expert Review",
      highlights: ["ATS-friendly", "Templates", "Peer Review"]
    },
    {
      icon: Trophy,
      title: "Daily Challenges",
      description: "Compete with peers through daily coding and HR challenges",
      badge: "Competitive",
      highlights: ["Leaderboard", "Streaks", "Achievements"]
    },
    {
      icon: Users,
      title: "Student Experiences",
      description: "Learn from real interview experiences at top companies",
      badge: "Community",
      highlights: ["Company-specific", "Success Stories", "Tips & Tricks"]
    },
    {
      icon: Brain,
      title: "Learning Resources",
      description: "Comprehensive study materials and cheat sheets for all topics",
      badge: "Complete",
      highlights: ["DBMS, OS, CN", "Interview Tips", "Sample Answers"]
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
            Everything You Need to{" "}
            <span className="text-primary">Succeed</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From coding practice to interview simulation, we provide comprehensive 
            tools to prepare you for any technical interview.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="card-hover border-0 shadow-md bg-card/50 backdrop-blur">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <span className="text-sm text-muted-foreground">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Timer className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold">Ready to start your journey?</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Join thousands of students who have successfully cracked their dream interviews
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-gradient px-8 py-3 rounded-lg text-white font-medium">
                Start Free Practice
              </button>
              <button className="border border-primary text-primary px-8 py-3 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors">
                View All Features
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;