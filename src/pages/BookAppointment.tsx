import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, Calendar, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const services = [
  "Braces, Routine Check-up & Consultation",
  "Dental Implants",
  "Gum Treatment",
  "Tooth Whitening",
  "Veneers (Cosmetic Dentistry)",
  "Scaling & Polishing",
  "Root Canal Treatment",
];

const BookAppointment = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    time: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const [firstName, ...lastParts] = formData.name.trim().split(" ");
      const lastName = lastParts.join(" ") || "-";

      // Check if patient exists by phone, otherwise create
      const { data: existing } = await supabase
        .from("patients")
        .select("id")
        .eq("phone", formData.phone)
        .maybeSingle();

      let patientId: string;
      if (existing) {
        patientId = existing.id;
      } else {
        const { data: newPatient, error: patErr } = await supabase
          .from("patients")
          .insert({
            first_name: firstName,
            last_name: lastName,
            phone: formData.phone,
            email: formData.email || null,
          })
          .select("id")
          .single();
        if (patErr) throw patErr;
        patientId = newPatient.id;
      }

      // Get a dentist to assign
      const { data: dentists } = await supabase
        .from("staff")
        .select("id")
        .eq("role", "dentist")
        .eq("status", "active")
        .limit(1);
      const staffId = dentists?.[0]?.id;
      if (!staffId) throw new Error("No dentist available. Please call us to book.");

      // Create the appointment
      const { error: apptErr } = await supabase.from("appointments").insert({
        patient_id: patientId,
        staff_id: staffId,
        appointment_date: formData.date || new Date().toISOString().split("T")[0],
        appointment_time: formData.time || "09:00 AM",
        notes: `Service: ${formData.service}. ${formData.message}`.trim(),
        status: "pending",
        is_walk_in: false,
      });
      if (apptErr) throw apptErr;

      setIsSubmitted(true);
      toast({
        title: "Appointment Booked!",
        description: "Your appointment has been recorded. We'll contact you to confirm.",
      });
    } catch (err: any) {
      toast({
        title: "Booking Failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isSubmitted) {
    return (
      <Layout>
        <section className="py-16 md:py-24 bg-gradient-to-br from-dental-teal-pale via-background to-dental-mint min-h-[60vh] flex items-center">
          <div className="container">
            <div className="max-w-lg mx-auto text-center space-y-6">
              <div className="h-20 w-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-secondary" />
              </div>
              <h1 className="text-3xl font-bold text-primary">Thank You!</h1>
              <p className="text-muted-foreground">
                Your appointment request has been received. Our team will contact you within 
                24 hours to confirm your appointment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to="/">Return Home</Link>
                </Button>
                <Button asChild variant="outline">
                  <a href="tel:07088788880">Call Us Now</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-dental-teal-pale via-background to-dental-mint">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold text-primary sm:text-5xl">
              Book Your <span className="text-secondary">Appointment</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Take the first step towards a healthier smile. Fill out the form below and we'll 
              get back to you to confirm your appointment.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary">Contact Information</h2>
              <div className="space-y-4">
                <Card className="border-0 bg-muted">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Phone</h4>
                      <a href="tel:07088788880" className="text-muted-foreground text-sm hover:text-secondary">
                        070 8878 8880
                      </a>
                      <br />
                      <a href="tel:09077766681" className="text-muted-foreground text-sm hover:text-secondary">
                        090 7776 6681
                      </a>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-muted">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Email</h4>
                      <a href="mailto:Vista.dcs@gmail.com" className="text-muted-foreground text-sm hover:text-secondary">
                        Vista.dcs@gmail.com
                      </a>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-muted">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Address</h4>
                      <p className="text-muted-foreground text-sm">
                        Shop 221, Axis Plaza, Plot 678, Rachel T. Owolabi Close, Gaduwa, Abuja.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-muted">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Working Hours</h4>
                      <p className="text-muted-foreground text-sm">
                        Mon - Sat: 9:00 AM - 6:00 PM
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 bg-muted">
                <CardContent className="p-6 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your full name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="Your phone number"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Your email address"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service">Preferred Service *</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, service: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="date">Preferred Date</Label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          value={formData.date}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Preferred Time</Label>
                        <Input
                          id="time"
                          name="time"
                          type="time"
                          value={formData.time}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us about your dental concerns or any specific requests..."
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full bg-secondary hover:bg-secondary/90" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calendar className="mr-2 h-4 w-4" />}
                      {isSubmitting ? "Booking..." : "Book Appointment"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BookAppointment;
