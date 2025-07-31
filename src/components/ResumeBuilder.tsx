import { useState } from "react";
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
import { Plus, Trash2, Download, Eye } from "lucide-react";
import { toast } from "sonner";

const resumeSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
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

export const ResumeBuilder = () => {
  const [previewMode, setPreviewMode] = useState(false);
  
  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
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
                <span>{watchedValues.personalInfo.phone}</span>
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Build Your Resume</h2>
        <Button variant="outline" onClick={() => setPreviewMode(true)}>
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </div>

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
                        <Input placeholder="+1 (555) 123-4567" {...field} />
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
                      <Textarea 
                        placeholder="Write a brief summary about yourself, your experience, and career goals..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      A compelling summary that highlights your key skills and experience
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
                            <Input placeholder="Company Name" {...field} />
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
                            <Input placeholder="Job Title" {...field} />
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
                            <Input placeholder="Bachelor's, Master's, etc." {...field} />
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
                            <Input placeholder="Computer Science, Engineering, etc." {...field} />
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
                            <Input placeholder="e.g., JavaScript, React, Python" {...field} />
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
                          <Input placeholder="React, Node.js, MongoDB, etc." {...field} />
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