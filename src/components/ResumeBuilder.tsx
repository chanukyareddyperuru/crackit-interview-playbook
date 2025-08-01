import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Trash2, Download, Eye, ChevronDown, Upload, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/useFileUpload";

const resumeSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    countryCode: z.string().default("+1"),
    location: z.string().min(1, "Location is required"),
    summary: z.string().min(50, "Summary should be at least 50 characters"),
  }),
  experience: z.array(z.object({
    company: z.string().min(1, "Company is required"),
    position: z.string().min(1, "Position is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string(),
    description: z.string().min(1, "Description is required"),
    current: z.boolean().default(false),
  })),
  education: z.array(z.object({
    institution: z.string().min(1, "Institution is required"),
    degree: z.string().min(1, "Degree is required"),
    field: z.string().min(1, "Field of study is required"),
    graduationYear: z.string().min(1, "Graduation year is required"),
  })),
  skills: z.array(z.string()),
  projects: z.array(z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().min(1, "Project description is required"),
    technologies: z.string().min(1, "Technologies used is required"),
    link: z.string().optional(),
  })),
});

type ResumeData = z.infer<typeof resumeSchema>;

// Suggestions data
const suggestionsByField = {
  summary: [
    "Experienced software developer with 5+ years in building scalable web applications",
    "Results-driven marketing professional with expertise in digital campaigns and analytics",
    "Dedicated customer service representative with strong communication and problem-solving skills",
    "Creative graphic designer specializing in brand identity and user experience design",
    "Detail-oriented project manager with proven track record of delivering projects on time"
  ],
  position: [
    "Software Engineer", "Full Stack Developer", "Frontend Developer", "Backend Developer",
    "Product Manager", "UX/UI Designer", "Data Analyst", "Marketing Manager",
    "Sales Representative", "Customer Success Manager", "Project Manager", "DevOps Engineer"
  ],
  company: [
    "Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix", "Adobe", "Salesforce",
    "Tesla", "Uber", "Airbnb", "Spotify", "Twitter", "LinkedIn", "GitHub", "Slack"
  ],
  skills: [
    "JavaScript", "Python", "React", "Node.js", "TypeScript", "AWS", "Docker", "MongoDB",
    "PostgreSQL", "Git", "HTML/CSS", "Java", "C++", "Machine Learning", "Data Analysis",
    "Project Management", "Agile", "Scrum", "Communication", "Leadership"
  ],
  degree: [
    "Bachelor's", "Master's", "PhD", "Associate", "Certificate", "Diploma"
  ],
  field: [
    "Computer Science", "Software Engineering", "Information Technology", "Business Administration",
    "Marketing", "Graphic Design", "Psychology", "Engineering", "Mathematics", "Data Science"
  ],
  technologies: [
    "React, Node.js, MongoDB", "Python, Django, PostgreSQL", "JavaScript, Express, MySQL",
    "Vue.js, PHP, Laravel", "Angular, .NET, SQL Server", "Flutter, Dart, Firebase"
  ]
};

const countryCodes = [
  { code: "+1", country: "US/CA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+7", country: "Russia", flag: "🇷🇺" }
];

// Suggestion component
const SuggestionPopup = ({ suggestions, onSelect, children }: { 
  suggestions: string[], 
  onSelect: (suggestion: string) => void,
  children: React.ReactNode 
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div onClick={() => setOpen(true)}>
          {children}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2 bg-background border shadow-md z-50">
        <div className="text-sm font-medium mb-2">Suggestions:</div>
        <div className="max-h-32 overflow-y-auto space-y-1">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-2 text-sm cursor-pointer hover:bg-muted rounded transition-colors"
              onClick={() => {
                onSelect(suggestion);
                setOpen(false);
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Resume Templates
const resumeTemplates = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean, contemporary design with subtle colors",
    preview: "Modern template with clean lines and professional layout",
    colors: {
      primary: "hsl(var(--primary))",
      secondary: "hsl(var(--secondary))",
      accent: "hsl(var(--accent))"
    }
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional format preferred by most employers",
    preview: "Traditional black and white professional template",
    colors: {
      primary: "#000000",
      secondary: "#333333",
      accent: "#666666"
    }
  },
  {
    id: "creative",
    name: "Creative",
    description: "Colorful design for creative professionals",
    preview: "Vibrant template with creative flair and modern typography",
    colors: {
      primary: "#3B82F6",
      secondary: "#8B5CF6",
      accent: "#F59E0B"
    }
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple, clean design with lots of white space",
    preview: "Minimalist template focusing on content over design",
    colors: {
      primary: "#1F2937",
      secondary: "#6B7280",
      accent: "#9CA3AF"
    }
  }
];

export const ResumeBuilder = () => {
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [showTemplates, setShowTemplates] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const { analyzeResume, isAnalyzing } = useFileUpload();
  
  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        countryCode: "+1",
        location: "",
        summary: "",
      },
      experience: [{ company: "", position: "", startDate: "", endDate: "", description: "", current: false }],
      education: [{ institution: "", degree: "", field: "", graduationYear: "" }],
      skills: [""],
      projects: [{ name: "", description: "", technologies: "", link: "" }],
    },
  });

  const { watch, setValue, getValues } = form;
  const watchedValues = watch();

  const addExperience = () => {
    const current = getValues("experience");
    setValue("experience", [...current, { company: "", position: "", startDate: "", endDate: "", description: "", current: false }]);
  };

  const removeExperience = (index: number) => {
    const current = getValues("experience");
    setValue("experience", current.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    const current = getValues("education");
    setValue("education", [...current, { institution: "", degree: "", field: "", graduationYear: "" }]);
  };

  const removeEducation = (index: number) => {
    const current = getValues("education");
    setValue("education", current.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    const current = getValues("skills");
    setValue("skills", [...current, ""]);
  };

  const removeSkill = (index: number) => {
    const current = getValues("skills");
    setValue("skills", current.filter((_, i) => i !== index));
  };

  const addProject = () => {
    const current = getValues("projects");
    setValue("projects", [...current, { name: "", description: "", technologies: "", link: "" }]);
  };

  const removeProject = (index: number) => {
    const current = getValues("projects");
    setValue("projects", current.filter((_, i) => i !== index));
  };

  const handleDownload = () => {
    toast.success("Resume downloaded successfully!");
  };

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      const analyzedData = await analyzeResume(file);
      
      // Update form with analyzed data
      if (analyzedData.personalInfo) {
        Object.keys(analyzedData.personalInfo).forEach((key) => {
          if (analyzedData.personalInfo[key]) {
            setValue(`personalInfo.${key}` as any, analyzedData.personalInfo[key]);
          }
        });
      }
      
      if (analyzedData.experience?.length) {
        setValue("experience", analyzedData.experience);
      }
      
      if (analyzedData.education?.length) {
        setValue("education", analyzedData.education);
      }
      
      if (analyzedData.skills?.length) {
        setValue("skills", analyzedData.skills);
      }
      
      if (analyzedData.projects?.length) {
        setValue("projects", analyzedData.projects);
      }
      
      if (analyzedData.suggestions) {
        toast.success("Resume analyzed! Check the suggestions for improvements.", {
          description: analyzedData.suggestions.slice(0, 100) + "..."
        });
      }
    } catch (error) {
      console.error("Error handling file upload:", error);
    }
  }, [analyzeResume, setValue]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const resumeFile = files.find(file => 
      file.type === 'application/pdf' || 
      file.type === 'text/plain' ||
      file.name.toLowerCase().includes('.pdf') ||
      file.name.toLowerCase().includes('.txt')
    );
    
    if (resumeFile) {
      handleFileUpload(resumeFile);
    } else {
      toast.error("Please upload a PDF or TXT file");
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const onSubmit = (data: ResumeData) => {
    console.log("Resume data:", data);
    toast.success("Resume saved successfully!");
  };

  if (previewMode) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Resume Preview</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setPreviewMode(false)}>
              <Eye className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
        
        {/* Resume Preview */}
        <Card className="p-8 bg-white text-black min-h-[800px]">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center border-b pb-4">
              <h1 className="text-3xl font-bold">{watchedValues.personalInfo.fullName || "Your Name"}</h1>
              <div className="flex justify-center gap-4 mt-2 text-sm text-gray-600">
                <span>{watchedValues.personalInfo.email}</span>
                <span>{watchedValues.personalInfo.countryCode} {watchedValues.personalInfo.phone}</span>
                <span>{watchedValues.personalInfo.location}</span>
              </div>
            </div>

            {/* Summary */}
            {watchedValues.personalInfo.summary && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Professional Summary</h2>
                <p className="text-gray-700">{watchedValues.personalInfo.summary}</p>
              </div>
            )}

            {/* Experience */}
            {watchedValues.experience.some(exp => exp.company) && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Experience</h2>
                <div className="space-y-4">
                  {watchedValues.experience.filter(exp => exp.company).map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{exp.position}</h3>
                          <p className="text-gray-600">{exp.company}</p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-2">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {watchedValues.education.some(edu => edu.institution) && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Education</h2>
                <div className="space-y-3">
                  {watchedValues.education.filter(edu => edu.institution).map((edu, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                        <p className="text-gray-600">{edu.institution}</p>
                      </div>
                      <span className="text-sm text-gray-500">{edu.graduationYear}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {watchedValues.skills.some(skill => skill.trim()) && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {watchedValues.skills.filter(skill => skill.trim()).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {watchedValues.projects.some(project => project.name) && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Projects</h2>
                <div className="space-y-4">
                  {watchedValues.projects.filter(project => project.name).map((project, index) => (
                    <div key={index}>
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-gray-700">{project.description}</p>
                      <p className="text-sm text-gray-600 mt-1">Technologies: {project.technologies}</p>
                      {project.link && (
                        <a href={project.link} className="text-blue-600 text-sm hover:underline">
                          View Project
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (showTemplates) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Choose a Template</h2>
          <Button variant="outline" onClick={() => setShowTemplates(false)}>
            Back to Builder
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resumeTemplates.map((template) => (
            <Card 
              key={template.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => {
                setSelectedTemplate(template.id);
                setShowTemplates(false);
                toast.success(`${template.name} template selected!`);
              }}
            >
              <CardHeader>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center mb-4">
                  <div className="text-center p-4">
                    <div className="w-full h-2 rounded mb-2" style={{ backgroundColor: template.colors.primary }}></div>
                    <div className="w-3/4 h-1 rounded mb-1" style={{ backgroundColor: template.colors.secondary }}></div>
                    <div className="w-1/2 h-1 rounded" style={{ backgroundColor: template.colors.accent }}></div>
                  </div>
                </div>
                <Badge 
                  variant={selectedTemplate === template.id ? "default" : "secondary"}
                  className="w-full justify-center"
                >
                  {selectedTemplate === template.id ? "Selected" : "Select Template"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Current Template: {resumeTemplates.find(t => t.id === selectedTemplate)?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {resumeTemplates.find(t => t.id === selectedTemplate)?.preview}
            </p>
            <Button onClick={() => setShowTemplates(false)}>
              Continue with {resumeTemplates.find(t => t.id === selectedTemplate)?.name} Template
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Build Your Resume</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowTemplates(true)}>
            Templates
          </Button>
          <Button variant="outline" onClick={() => setPreviewMode(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* File Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-all duration-200 ${
          isDragOver 
            ? 'border-primary bg-primary/5 scale-[1.02]' 
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {isAnalyzing ? (
                <Sparkles className="w-12 h-12 text-primary animate-pulse" />
              ) : (
                <Upload className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {isAnalyzing ? "Analyzing Your Resume..." : "Upload Your Existing Resume"}
              </h3>
              <p className="text-muted-foreground">
                {isAnalyzing 
                  ? "Our AI is extracting information from your resume. This may take a moment."
                  : "Drop your resume here or click to browse. We'll analyze it with AI and auto-fill the form!"
                }
              </p>
            </div>
            {!isAnalyzing && (
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.pdf,.txt';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFileUpload(file);
                    };
                    input.click();
                  }}
                  className="gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Choose File
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, TXT
            </p>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="personalInfo.fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="personalInfo.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="personalInfo.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <FormField
                            control={form.control}
                            name="personalInfo.countryCode"
                            render={({ field: countryField }) => (
                              <Select onValueChange={countryField.onChange} value={countryField.value}>
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-background border shadow-md z-50">
                                  {countryCodes.map((country) => (
                                    <SelectItem key={country.code} value={country.code}>
                                      {country.flag} {country.code}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          <Input 
                            placeholder="(555) 123-4567" 
                            className="flex-1"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="personalInfo.location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="New York, NY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="personalInfo.summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Summary</FormLabel>
                    <FormControl>
                      <SuggestionPopup
                        suggestions={suggestionsByField.summary}
                        onSelect={(suggestion) => field.onChange(suggestion)}
                      >
                        <Textarea 
                          placeholder="Write a brief summary about yourself, your experience, and career goals..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </SuggestionPopup>
                    </FormControl>
                    <FormDescription>
                      A compelling summary that highlights your key skills and experience. Click to see suggestions!
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Work Experience</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {watchedValues.experience.map((_, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                  {watchedValues.experience.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeExperience(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`experience.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <SuggestionPopup
                              suggestions={suggestionsByField.company}
                              onSelect={(suggestion) => field.onChange(suggestion)}
                            >
                              <Input placeholder="Company Name" {...field} />
                            </SuggestionPopup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`experience.${index}.position`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <SuggestionPopup
                              suggestions={suggestionsByField.position}
                              onSelect={(suggestion) => field.onChange(suggestion)}
                            >
                              <Input placeholder="Job Title" {...field} />
                            </SuggestionPopup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`experience.${index}.startDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input placeholder="Jan 2020" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`experience.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input placeholder="Dec 2022 or leave blank if current" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`experience.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your responsibilities and achievements..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Education</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addEducation}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {watchedValues.education.map((_, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                  {watchedValues.education.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeEducation(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`education.${index}.institution`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institution</FormLabel>
                          <FormControl>
                            <Input placeholder="University Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`education.${index}.degree`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Degree</FormLabel>
                          <FormControl>
                            <SuggestionPopup
                              suggestions={suggestionsByField.degree}
                              onSelect={(suggestion) => field.onChange(suggestion)}
                            >
                              <Input placeholder="Bachelor's, Master's, etc." {...field} />
                            </SuggestionPopup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`education.${index}.field`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Field of Study</FormLabel>
                          <FormControl>
                            <SuggestionPopup
                              suggestions={suggestionsByField.field}
                              onSelect={(suggestion) => field.onChange(suggestion)}
                            >
                              <Input placeholder="Computer Science, Engineering, etc." {...field} />
                            </SuggestionPopup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`education.${index}.graduationYear`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Graduation Year</FormLabel>
                          <FormControl>
                            <Input placeholder="2024" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Skills</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {watchedValues.skills.map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`skills.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <SuggestionPopup
                              suggestions={suggestionsByField.skills}
                              onSelect={(suggestion) => field.onChange(suggestion)}
                            >
                              <Input placeholder="e.g., JavaScript, React, Python" {...field} />
                            </SuggestionPopup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {watchedValues.skills.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Projects</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addProject}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {watchedValues.projects.map((_, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                  {watchedValues.projects.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeProject(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`projects.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input placeholder="My Awesome Project" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`projects.${index}.link`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Link (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://github.com/yourproject" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`projects.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what the project does and your role..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`projects.${index}.technologies`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Technologies Used</FormLabel>
                        <FormControl>
                          <SuggestionPopup
                            suggestions={suggestionsByField.technologies}
                            onSelect={(suggestion) => field.onChange(suggestion)}
                          >
                            <Input placeholder="React, Node.js, MongoDB, etc." {...field} />
                          </SuggestionPopup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Save Resume
            </Button>
            <Button type="button" variant="outline" onClick={() => setPreviewMode(true)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview & Download
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};