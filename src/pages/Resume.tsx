import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Globe, Download, Eye } from "lucide-react";
import { ResumeBuilder } from "@/components/ResumeBuilder";
import { PortfolioConverter } from "@/components/PortfolioConverter";
import { toast } from "sonner";

const Resume = () => {
  const [activeTab, setActiveTab] = useState("builder");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Resume & Portfolio Builder
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create professional resumes and convert them into interactive portfolios. 
            Perfect for tech newcomers and experienced professionals alike.
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Resume Builder
            </TabsTrigger>
            <TabsTrigger value="converter" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Resume to Portfolio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Simple Resume Builder
                </CardTitle>
                <CardDescription>
                  Build your professional resume step by step. No design experience needed - 
                  just fill in your information and we'll make it look great!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResumeBuilder />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="converter" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Resume to Portfolio Converter
                </CardTitle>
                <CardDescription>
                  Transform your resume into an interactive portfolio website. 
                  Perfect for showcasing your skills and projects online.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PortfolioConverter />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <FileText className="w-8 h-8 mx-auto text-primary" />
              <CardTitle className="text-lg">ATS-Friendly</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All templates are optimized for Applicant Tracking Systems
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Download className="w-8 h-8 mx-auto text-primary" />
              <CardTitle className="text-lg">Export Options</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Download as PDF, share online, or convert to portfolio
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Eye className="w-8 h-8 mx-auto text-primary" />
              <CardTitle className="text-lg">Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                See your resume update in real-time as you type
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Resume;