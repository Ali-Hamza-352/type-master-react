
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Mail } from "lucide-react";

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Form sent successfully!");
      setSubmitting(false);
      setForm({ name: "", email: "", message: "" });
    }, 1200);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block font-medium mb-1">
                Name
              </label>
              <Input
                id="name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="message" className="block font-medium mb-1">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                required
                value={form.message}
                onChange={handleChange}
                placeholder="Write your message..."
                rows={5}
              />
            </div>
            <Button disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700" type="submit" size="lg">
              <Mail className="mr-2" />{submitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
          <div className="mt-6 text-xs text-center text-muted-foreground">
            Note: This demo does not send real emails.<br />
            To enable real sending, connect a backend (e.g., using Nodemailer).
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactUs;
