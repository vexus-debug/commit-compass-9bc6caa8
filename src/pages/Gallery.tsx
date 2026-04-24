import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Camera, Image as ImageIcon, Sparkles } from "lucide-react";

const beforeAfterItems = [
  { title: "Teeth Whitening", description: "Professional whitening treatment results" },
  { title: "Dental Veneers", description: "Smile transformation with veneers" },
  { title: "Orthodontics", description: "Teeth alignment correction" },
  { title: "Dental Implants", description: "Natural-looking tooth replacement" },
];

const clinicPhotos = [
  "Reception Area",
  "Treatment Room 1",
  "Treatment Room 2",
  "Waiting Area",
  "Dental Equipment",
  "Sterilization Area",
];

const Gallery = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-dental-teal-pale via-background to-dental-mint">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold text-primary sm:text-5xl">
              Our <span className="text-secondary">Gallery</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              See the results of our work and take a virtual tour of our modern dental clinic.
            </p>
          </div>
        </div>
      </section>

      {/* Before & After */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-primary">
              Before & <span className="text-secondary">After</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See the transformations our patients have experienced.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {beforeAfterItems.map((item) => (
              <Card key={item.title} className="border-0 bg-muted overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-2">
                    <div className="aspect-square bg-card flex items-center justify-center border-r">
                      <div className="text-center text-muted-foreground">
                        <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Before</p>
                      </div>
                    </div>
                    <div className="aspect-square bg-secondary/5 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Sparkles className="h-12 w-12 mx-auto mb-2 opacity-30 text-secondary" />
                        <p className="text-sm">After</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Clinic Photos */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-primary">
              Our <span className="text-secondary">Clinic</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Take a virtual tour of our modern, comfortable dental facility.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clinicPhotos.map((photo) => (
              <Card key={photo} className="border-0 bg-card overflow-hidden group">
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted flex items-center justify-center group-hover:bg-secondary/5 transition-colors">
                    <div className="text-center text-muted-foreground">
                      <Camera className="h-12 w-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">{photo}</p>
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
          <h2 className="text-3xl font-bold">Ready to Transform Your Smile?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Book a consultation and start your journey to a beautiful smile.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-secondary hover:bg-secondary/90">
            <Link to="/book-appointment">Book Appointment</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Gallery;
