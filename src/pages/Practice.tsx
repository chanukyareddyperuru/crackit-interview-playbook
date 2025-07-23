import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Clock, 
  Star, 
  Code, 
  Database, 
  Cpu, 
  Network,
  ChevronRight
} from "lucide-react";

const Practice = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Topics", icon: Code, count: 500 },
    { id: "arrays", name: "Arrays", icon: Code, count: 85 },
    { id: "trees", name: "Trees", icon: Network, count: 65 },
    { id: "dp", name: "Dynamic Programming", icon: Cpu, count: 45 },
    { id: "dbms", name: "Database", icon: Database, count: 75 },
    { id: "os", name: "Operating Systems", icon: Cpu, count: 55 },
    { id: "system", name: "System Design", icon: Network, count: 35 }
  ];

  const problems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      category: "Arrays",
      description: "Find two numbers in an array that add up to a target sum",
      companies: ["Google", "Amazon", "Facebook"],
      acceptance: 49.2,
      timeToSolve: "15 min"
    },
    {
      id: 2,
      title: "Binary Tree Inorder Traversal",
      difficulty: "Medium",
      category: "Trees",
      description: "Traverse a binary tree in inorder and return the values",
      companies: ["Microsoft", "Apple", "Netflix"],
      acceptance: 74.1,
      timeToSolve: "25 min"
    },
    {
      id: 3,
      title: "Longest Palindromic Substring",
      difficulty: "Medium",
      category: "Dynamic Programming",
      description: "Find the longest palindromic substring in a given string",
      companies: ["Amazon", "Google", "Uber"],
      acceptance: 32.8,
      timeToSolve: "35 min"
    },
    {
      id: 4,
      title: "Merge k Sorted Lists",
      difficulty: "Hard",
      category: "Linked Lists",
      description: "Merge k sorted linked lists and return it as one sorted list",
      companies: ["Facebook", "Google", "LinkedIn"],
      acceptance: 47.6,
      timeToSolve: "45 min"
    },
    {
      id: 5,
      title: "Database Normalization",
      difficulty: "Medium",
      category: "DBMS",
      description: "Understanding database normalization forms and their applications",
      companies: ["Oracle", "Microsoft", "IBM"],
      acceptance: 68.3,
      timeToSolve: "30 min"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "difficulty-easy";
      case "Medium": return "difficulty-medium";
      case "Hard": return "difficulty-hard";
      default: return "difficulty-easy";
    }
  };

  const filteredProblems = problems.filter(problem => 
    problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Practice Arena
            </h1>
            <p className="text-lg text-muted-foreground">
              Master coding interviews with 500+ problems from top companies. 
              Practice, learn, and track your progress.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Categories</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <category.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search problems, topics, or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Problems List */}
            <div className="space-y-4">
              {filteredProblems.map((problem) => (
                <Card key={problem.id} className="card-hover cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-foreground">
                            {problem.title}
                          </h3>
                          <Badge className={`text-xs px-2 py-1 ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {problem.category}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground">
                          {problem.description}
                        </p>
                        
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4" />
                            <span>{problem.acceptance}% acceptance</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{problem.timeToSolve}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {problem.companies.map((company) => (
                            <Badge key={company} variant="secondary" className="text-xs">
                              {company}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Button className="ml-4">
                        Solve
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center pt-8">
              <Button variant="outline" size="lg">
                Load More Problems
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;