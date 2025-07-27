import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Mic, 
  Clock, 
  User, 
  Play, 
  Settings,
  Brain,
  MessageSquare,
  Users,
  Star
} from "lucide-react";

const Interview = () => {
  const interviewTypes = [
    {
      id: "technical",
      title: "Technical Interview",
      description: "Practice coding problems with AI interviewer feedback",
      duration: "45-60 min",
      difficulty: "Medium",
      features: ["Live coding", "Real-time feedback", "Multiple languages"],
      icon: Brain,
      gradient: "from-blue-500 to-purple-600"
    },
    {
      id: "behavioral",
      title: "HR/Behavioral Round",
      description: "Master behavioral questions and soft skills assessment",
      duration: "30-45 min", 
      difficulty: "Easy",
      features: ["Common questions", "Answer templates", "Communication tips"],
      icon: MessageSquare,
      gradient: "from-green-500 to-teal-600"
    },
    {
      id: "system-design",
      title: "System Design",
      description: "Design scalable systems with guided framework",
      duration: "60-90 min",
      difficulty: "Hard", 
      features: ["Architecture patterns", "Scalability", "Trade-offs"],
      icon: Settings,
      gradient: "from-orange-500 to-red-600"
    },
    {
      id: "group",
      title: "Group Discussion",
      description: "Practice leadership and teamwork in group settings",
      duration: "20-30 min",
      difficulty: "Medium",
      features: ["Leadership skills", "Team dynamics", "Communication"],
      icon: Users,
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  const recentSessions = [
    {
      type: "Technical",
      company: "Google",
      score: 8.5,
      date: "2 hours ago",
      feedback: "Great problem-solving approach. Work on edge cases."
    },
    {
      type: "Behavioral", 
      company: "Microsoft",
      score: 9.2,
      date: "1 day ago",
      feedback: "Excellent storytelling and STAR method usage."
    },
    {
      type: "System Design",
      company: "Amazon",
      score: 7.8,
      date: "3 days ago", 
      feedback: "Good architecture. Consider more about scalability."
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-green-600 bg-green-50 border-green-200";
      case "Medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Hard": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-green-600 bg-green-50 border-green-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Interview Simulator
            </h1>
            <p className="text-lg text-muted-foreground">
              Practice with AI-powered mock interviews. Get real-time feedback and 
              build confidence for your actual interviews.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Interview Types */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Choose Interview Type
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {interviewTypes.map((type) => (
                  <Card key={type.id} className="card-hover cursor-pointer border-0 shadow-md">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${type.gradient} rounded-lg flex items-center justify-center`}>
                          <type.icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge className={`text-xs px-2 py-1 ${getDifficultyColor(type.difficulty)}`}>
                          {type.difficulty}
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-xl">{type.title}</CardTitle>
                      <CardDescription>{type.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{type.duration}</span>
                      </div>
                      
                      <div className="space-y-2">
                        {type.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button className="w-full btn-gradient">
                        <Play className="w-4 h-4 mr-2" />
                        Start Interview
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Start */}
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Video className="w-5 h-5 text-primary" />
                  <span>Quick Start Interview</span>
                </CardTitle>
                <CardDescription>
                  Jump into a random interview session based on your skill level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <User className="w-6 h-6" />
                    <span>Beginner</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Brain className="w-6 h-6" />
                    <span>Intermediate</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Star className="w-6 h-6" />
                    <span>Advanced</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Setup Check */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Setup Check</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Video className="w-4 h-4" />
                    <span className="text-sm">Camera</span>
                  </div>
                  <Badge variant="default" className="text-xs bg-success">Ready</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mic className="w-4 h-4" />
                    <span className="text-sm">Microphone</span>
                  </div>
                  <Badge variant="default" className="text-xs bg-success">Ready</Badge>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Test Setup
                </Button>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentSessions.map((session, idx) => (
                  <div key={idx} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {session.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {session.date}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{session.company}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-sm font-medium">{session.score}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {session.feedback}
                    </p>
                  </div>
                ))}
                
                <Button variant="outline" size="sm" className="w-full">
                  View All Sessions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Practice Interviews Section */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <Card className="shadow-lg border-0 rounded-2xl bg-gradient-to-br from-background to-muted/20">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Practice Interviews
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Simulate real HR, Technical, or System Design interviews with live feedback.
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-xl px-8 py-6 text-lg rounded-xl"
                onClick={() => window.location.href = '/interview-room'}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Interview
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Interview;