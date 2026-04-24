import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Amina O.",
    rating: 5,
    text: "Vista Dental Care transformed my smile! The team is incredibly professional and made me feel comfortable throughout my treatment. I highly recommend them for anyone looking for quality dental care.",
    service: "Teeth Whitening",
  },
  {
    name: "Chukwudi E.",
    rating: 5,
    text: "Best dental experience I've ever had. The clinic is modern and clean, and the staff are so friendly. They took the time to explain every step of my treatment.",
    service: "Dental Implants",
  },
  {
    name: "Fatima M.",
    rating: 5,
    text: "I was so nervous about my root canal, but the team at Vista made it completely painless. Thank you for your gentle care and patience with me!",
    service: "Root Canal",
  },
  {
    name: "Emeka N.",
    rating: 5,
    text: "The orthodontic treatment I received was excellent. My teeth are now perfectly aligned and I couldn't be happier with the results. The team made the whole process smooth.",
    service: "Orthodontics",
  },
  {
    name: "Sarah A.",
    rating: 5,
    text: "I've been going to Vista for my family's dental needs for years now. They're always professional, caring, and use the latest technology. Highly recommended!",
    service: "General Dentistry",
  },
  {
    name: "Ibrahim K.",
    rating: 5,
    text: "Had a dental emergency and they squeezed me in the same day. The extraction was quick and painless. Excellent service and aftercare instructions.",
    service: "Tooth Extraction",
  },
];

const Testimonials = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-dental-teal-pale via-background to-dental-mint">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold text-primary sm:text-5xl">
              Patient <span className="text-secondary">Testimonials</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Don't just take our word for it. Here's what our patients have to say about their 
              experience at Vista Dental Care.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-card border-b">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3 text-center">
            <div>
              <div className="text-4xl font-bold text-secondary">500+</div>
              <div className="text-muted-foreground">Happy Patients</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary flex items-center justify-center gap-2">
                5.0 <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary">100%</div>
              <div className="text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-card">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-secondary/30 mb-4" />
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-semibold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-medium block">{testimonial.name}</span>
                        <span className="text-xs text-muted-foreground">{testimonial.service}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold">Join Our Happy Patients</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Experience the Vista Dental Care difference. Book your appointment today.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-secondary hover:bg-secondary/90">
            <Link to="/book-appointment">Book Appointment</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Testimonials;
