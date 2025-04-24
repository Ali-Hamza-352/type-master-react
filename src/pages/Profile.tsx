
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserProgress, checkCourseCompletion } from "@/utils/userProgress";
import { useNavigate } from "react-router-dom";
import { Edit, Award } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { generateCertificateHTML, downloadCertificate, CertificateData } from "@/utils/certificateGenerator";
import { useState, useEffect } from "react";
import { UserProgress } from "@/utils/userProgress";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedLessons: [],
    results: [],
    lastActivity: new Date().toISOString()
  });
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch user progress when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const progress = await getUserProgress();
        setUserProgress(progress);
        
        const isCompleted = await checkCourseCompletion();
        setCourseCompleted(isCompleted);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const avgWPM = userProgress.results.length
    ? Math.round(userProgress.results.reduce((acc, curr) => acc + curr.wpm, 0) / userProgress.results.length)
    : 0;
  
  const avgAccuracy = userProgress.results.length
    ? Math.round(userProgress.results.reduce((acc, curr) => acc + curr.accuracy, 0) / userProgress.results.length)
    : 0;
  
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const certificateData: CertificateData = {
    userName: user?.username || '',
    courseName: 'TypingMaster Touch Typing Course',
    completionDate: today,
    averageWPM: avgWPM,
    averageAccuracy: avgAccuracy
  };
  
  const handleDownloadCertificate = () => {
    downloadCertificate(certificateData);
  };
  
  if (!user) return null;
  if (isLoading) return <div className="container mx-auto py-6">Loading user data...</div>;
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">User Profile</CardTitle>
          <Button onClick={() => navigate('/profile/edit')} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Personal Information</h3>
              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Username</span>
                  <span className="font-medium">{user.username}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                {user.address && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Address</span>
                    <span className="font-medium">{user.address}</span>
                  </div>
                )}
                {user.country && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Country</span>
                    <span className="font-medium">{user.country}</span>
                  </div>
                )}
                {user.phoneNumber && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Phone Number</span>
                    <span className="font-medium">{user.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Typing Statistics</h3>
              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Completed Lessons</span>
                  <span className="font-medium">{userProgress.completedLessons.length} lessons</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Average WPM</span>
                  <span className="font-medium">{avgWPM} WPM</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Average Accuracy</span>
                  <span className="font-medium">{avgAccuracy}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Total Tests Taken</span>
                  <span className="font-medium">{userProgress.results.length}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Last Activity</span>
                  <span className="font-medium">
                    {new Date(userProgress.lastActivity).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {courseCompleted && (
            <div className="mt-6 border-t pt-6">
              <div className="flex flex-col items-center text-center">
                <Award className="h-12 w-12 text-yellow-500 mb-2" />
                <h3 className="text-xl font-bold mb-2">Course Completed!</h3>
                <p className="text-gray-600 mb-4">
                  Congratulations on completing the TypingMaster Touch Typing Course!
                </p>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Award className="h-4 w-4" />
                      View Certificate
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Your Certificate of Completion</DialogTitle>
                    </DialogHeader>
                    <div className="py-4" dangerouslySetInnerHTML={{ __html: generateCertificateHTML(certificateData) }} />
                    <div className="flex justify-center">
                      <Button onClick={handleDownloadCertificate}>
                        Download Certificate
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
