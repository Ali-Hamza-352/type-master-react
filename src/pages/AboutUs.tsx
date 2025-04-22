
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone } from "lucide-react";

const AboutUs = () => (
  <div className="flex justify-center items-center min-h-[80vh]">
    <Card className="max-w-lg w-full">
      <CardHeader>
        <CardTitle>About Us</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <div className="flex flex-col items-center space-y-2">
          <User className="text-blue-600" size={42} />
          <p className="text-lg font-semibold">Ali Hamza</p>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <Phone className="text-blue-600" size={32} />
          <p className="text-base">Contact Number: <span className="font-medium">03063099643</span></p>
        </div>
        <p className="mt-4 text-gray-600">
          Welcome! My name is Ali Hamza. This application is dedicated to helping users master touch typing efficiently and enjoyably.
        </p>
      </CardContent>
    </Card>
  </div>
);

export default AboutUs;
