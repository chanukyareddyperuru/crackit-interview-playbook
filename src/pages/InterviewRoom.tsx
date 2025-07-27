import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Mic, Phone, Settings } from "lucide-react";

const InterviewRoom = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Interview Room
            </h1>
            <p className="text-muted-foreground">
              Your AI interviewer will join you shortly. Make sure your camera and microphone are ready.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Video Area */}
            <div className="lg:col-span-3">
              <Card className="h-96 lg:h-[500px]">
                <CardContent className="h-full flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center space-y-4">
                    <Video className="w-16 h-16 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Camera feed will appear here</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Controls */}
              <div className="flex items-center justify-center space-x-4 mt-6">
                <Button variant="outline" size="lg" className="rounded-full w-14 h-14">
                  <Mic className="w-6 h-6" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full w-14 h-14">
                  <Video className="w-6 h-6" />
                </Button>
                <Button variant="destructive" size="lg" className="rounded-full w-14 h-14">
                  <Phone className="w-6 h-6" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full w-14 h-14">
                  <Settings className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Interview Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">Technical Interview</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">45 minutes</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Difficulty</p>
                    <p className="font-medium">Medium</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Speak clearly and confidently</li>
                    <li>• Think out loud while solving problems</li>
                    <li>• Ask clarifying questions if needed</li>
                    <li>• Take your time to understand the problem</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;