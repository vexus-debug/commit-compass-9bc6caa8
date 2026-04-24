import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, Send, Instagram, Facebook, Twitter } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-dental-teal-pale via-background to-dental-mint">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold text-primary sm:text-5xl">
              Contact <span className="text-secondary">Us</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions or need to reach us? We're here to help. Get in touch with our team today.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-6">Get In Touch</h2>
                <div className="space-y-4">
                  <Card className="border-0 bg-muted">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                        <MapPin className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Our Location</h4>
                        <p className="text-muted-foreground text-sm">
                          Shop 221, Axis Plaza, Plot 678,<br />
                          Rachel T. Owolabi Close,<br />
                          Gaduwa, Abuja.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 bg-muted">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                        <Phone className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Phone Numbers</h4>
                        <a href="tel:07088788880" className="text-muted-foreground text-sm hover:text-secondary block">
                          070 8878 8880
                        </a>
                        <a href="tel:09077766681" className="text-muted-foreground text-sm hover:text-secondary block">
                          090 7776 6681
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 bg-muted">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                        <Mail className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Email</h4>
                        <a href="mailto:Vista.dcs@gmail.com" className="text-muted-foreground text-sm hover:text-secondary">
                          Vista.dcs@gmail.com
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 bg-muted">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                        <Clock className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Working Hours</h4>
                        <p className="text-muted-foreground text-sm">
                          Monday - Saturday: 9:00 AM - 6:00 PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-primary mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="https://instagram.com/vista.dcs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center hover:bg-secondary/20 transition-colors"
                  >
                    <Instagram className="h-6 w-6 text-secondary" />
                  </a>
                  <a
                    href="#"
                    className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center hover:bg-secondary/20 transition-colors"
                  >
                    <Facebook className="h-6 w-6 text-secondary" />
                  </a>
                  <a
                    href="#"
                    className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center hover:bg-secondary/20 transition-colors"
                  >
                    <Twitter className="h-6 w-6 text-secondary" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="border-0 bg-muted">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-primary mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          required
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          required
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="Your phone number"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="How can we help?"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Your Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us how we can help you..."
                        rows={5}
                        required
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full bg-secondary hover:bg-secondary/90">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl font-bold text-primary">Find Us</h2>
            <p className="text-muted-foreground">Conveniently located in Gaduwa, Abuja</p>
          </div>
          <div className="rounded-2xl overflow-hidden bg-card h-[400px] flex items-center justify-center border">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="font-medium">Google Maps Placeholder</p>
              <p className="text-sm">Shop 221, Axis Plaza, Gaduwa, Abuja</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
