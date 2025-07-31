import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Globe, Download, Eye, Code, Palette, Smartphone } from "lucide-react";
import { toast } from "sonner";

interface PortfolioTheme {
  id: string;
  name: string;
  description: string;
  color: string;
  preview: string;
}

const themes: PortfolioTheme[] = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean, minimal design perfect for tech professionals",
    color: "bg-blue-500",
    preview: "Modern layout with hero section and card-based content"
  },
  {
    id: "creative",
    name: "Creative Portfolio",
    description: "Vibrant design for designers and creatives",
    color: "bg-purple-500",
    preview: "Colorful design with animations and visual elements"
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    description: "Simple, elegant design focusing on content",
    color: "bg-gray-500",
    preview: "Clean typography and lots of whitespace"
  },
  {
    id: "tech",
    name: "Tech Focused",
    description: "Developer-friendly with code snippets and project showcase",
    color: "bg-green-500",
    preview: "Terminal-inspired design with technical aesthetics"
  }
];

export const PortfolioConverter = () => {
  const [selectedTheme, setSelectedTheme] = useState("modern");
  const [portfolioData, setPortfolioData] = useState({
    name: "",
    title: "",
    bio: "",
    skills: [],
    projects: [],
    experience: [],
    contact: {
      email: "",
      github: "",
      linkedin: "",
      website: ""
    }
  });
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, you would parse the PDF/document here
      toast.success("Resume uploaded successfully! Fill in any missing details below.");
      
      // Mock data for demonstration
      setPortfolioData({
        name: "John Doe",
        title: "Full Stack Developer",
        bio: "Passionate developer with experience in React, Node.js, and cloud technologies.",
        skills: ["JavaScript", "React", "Node.js", "Python", "AWS"],
        projects: [
          {
            name: "E-commerce Platform",
            description: "Built a full-stack e-commerce solution with React and Node.js",
            technologies: "React, Node.js, MongoDB, Stripe",
            link: "https://github.com/johndoe/ecommerce"
          }
        ],
        experience: [
          {
            company: "Tech Corp",
            position: "Frontend Developer",
            duration: "2022 - Present",
            description: "Developed responsive web applications using React and TypeScript"
          }
        ],
        contact: {
          email: "john.doe@email.com",
          github: "github.com/johndoe",
          linkedin: "linkedin.com/in/johndoe",
          website: ""
        }
      });
    }
  };

  const generatePortfolio = async () => {
    setIsGenerating(true);
    
    // Simulate portfolio generation
    setTimeout(() => {
      const portfolioId = Math.random().toString(36).substring(7);
      setPortfolioUrl(`https://portfolio-${portfolioId}.lovable.app`);
      setIsGenerating(false);
      toast.success("Portfolio generated successfully!");
    }, 3000);
  };

  const PortfolioPreview = () => {
    const theme = themes.find(t => t.id === selectedTheme);
    
    return (
      <div className="border rounded-lg p-6 bg-white min-h-[600px]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {portfolioData.name || "Your Name"}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {portfolioData.title || "Your Title"}
          </p>
          <p className="text-gray-700 max-w-2xl mx-auto">
            {portfolioData.bio || "Your professional bio will appear here..."}
          </p>
        </div>

        {/* Skills */}
        {portfolioData.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {portfolioData.skills.map((skill, index) => (
                <Badge key={index} className={`${theme?.color} text-white`}>
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {portfolioData.projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Projects</h2>
            <div className="grid gap-4">
              {portfolioData.projects.map((project, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-2">{project.description}</p>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Technologies:</strong> {project.technologies}
                    </p>
                    {project.link && (
                      <a href={project.link} className="text-blue-600 hover:underline text-sm">
                        View Project →
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {portfolioData.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Experience</h2>
            <div className="space-y-4">
              {portfolioData.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-gray-200 pl-4">
                  <h3 className="font-semibold">{exp.position}</h3>
                  <p className="text-gray-600">{exp.company} • {exp.duration}</p>
                  <p className="text-gray-700 mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="text-center pt-8 border-t">
          <h2 className="text-2xl font-semibold mb-4">Get In Touch</h2>
          <div className="flex justify-center gap-4 text-sm">
            {portfolioData.contact.email && (
              <span>{portfolioData.contact.email}</span>
            )}
            {portfolioData.contact.github && (
              <span>GitHub</span>
            )}
            {portfolioData.contact.linkedin && (
              <span>LinkedIn</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Resume</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
          <TabsTrigger value="generate">Generate</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Your Resume
              </CardTitle>
              <CardDescription>
                Upload your existing resume and we'll extract the information to create your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop your resume here or click to browse
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports PDF, DOC, DOCX files up to 10MB
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload">
                  <Button variant="outline" className="cursor-pointer">
                    Choose File
                  </Button>
                </label>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Or start from scratch:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input
                      placeholder="John Doe"
                      value={portfolioData.name}
                      onChange={(e) => setPortfolioData({...portfolioData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Professional Title</label>
                    <Input
                      placeholder="Full Stack Developer"
                      value={portfolioData.title}
                      onChange={(e) => setPortfolioData({...portfolioData, title: e.target.value})}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <Textarea
                    placeholder="Tell us about yourself..."
                    value={portfolioData.bio}
                    onChange={(e) => setPortfolioData({...portfolioData, bio: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customize" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Choose Your Theme
              </CardTitle>
              <CardDescription>
                Select a theme that matches your style and profession
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedTheme === theme.id ? 'ring-2 ring-primary border-primary' : 'hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedTheme(theme.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-4 h-4 rounded-full ${theme.color} mt-1`}></div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{theme.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{theme.description}</p>
                        <p className="text-xs text-gray-500">{theme.preview}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Preview</CardTitle>
              <CardDescription>
                See how your portfolio will look with the selected theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PortfolioPreview />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Generate Your Portfolio
              </CardTitle>
              <CardDescription>
                Create your live portfolio website with a custom URL
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!portfolioUrl ? (
                <div className="text-center space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Ready to create your portfolio?</h3>
                    <p className="text-gray-600">
                      Your portfolio will be generated with the {themes.find(t => t.id === selectedTheme)?.name} theme
                      and will be accessible via a custom URL.
                    </p>
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={generatePortfolio}
                      disabled={isGenerating}
                      className="flex items-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4" />
                          Generate Portfolio
                        </>
                      )}
                    </Button>
                  </div>

                  {isGenerating && (
                    <div className="max-w-md mx-auto">
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          Setting up your portfolio structure...
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          Applying your selected theme...
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                          Optimizing for mobile devices...
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          Deploying to live URL...
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      🎉 Portfolio Created Successfully!
                    </h3>
                    <p className="text-green-700 mb-4">
                      Your portfolio is now live and ready to share with potential employers
                    </p>
                    <div className="flex items-center justify-center gap-2 p-3 bg-white rounded border">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <code className="text-sm font-mono">{portfolioUrl}</code>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button variant="outline" asChild>
                      <a href={portfolioUrl} target="_blank" rel="noopener noreferrer">
                        <Eye className="w-4 h-4 mr-2" />
                        View Portfolio
                      </a>
                    </Button>
                    <Button onClick={() => {
                      navigator.clipboard.writeText(portfolioUrl);
                      toast.success("Portfolio URL copied to clipboard!");
                    }}>
                      <Download className="w-4 h-4 mr-2" />
                      Copy URL
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-8">
                    <div className="text-center p-4 border rounded-lg">
                      <Smartphone className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                      <h4 className="font-medium">Mobile Optimized</h4>
                      <p className="text-sm text-gray-600">Looks great on all devices</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Code className="w-8 h-8 mx-auto text-green-500 mb-2" />
                      <h4 className="font-medium">SEO Optimized</h4>
                      <p className="text-sm text-gray-600">Discoverable by search engines</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Globe className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                      <h4 className="font-medium">Custom Domain</h4>
                      <p className="text-sm text-gray-600">Connect your own domain (Pro)</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};