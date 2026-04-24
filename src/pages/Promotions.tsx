import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart, Check, Calendar, Clock, Gift } from "lucide-react";

const includedServices = [
  "General & Preventive Dentistry",
  "Cosmetic Dentistry",
  "Orthodontics",
  "Restorative & Prosthodontics",
  "Dental Implants",
  "Oral Surgery",
  "Gum Treatment & Root Canal",
];

const Promotions = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-pink-500 to-rose-500 text-white">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
                💝 Limited Time Offer
              </div>
              <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
                Valentine's Day Special
              </h1>
              <p className="text-xl text-white/90">
                Show your smile some love this Valentine's season! Enjoy exclusive discounts 
                on all our dental services.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Feb 1 - 21, 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>3 Weeks Only</span>
                </div>
              </div>
              <Button asChild size="lg" className="bg-white text-rose-500 hover:bg-white/90">
                <Link to="/book-appointment">Book Now & Save 25%</Link>
              </Button>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-72 w-72 rounded-full bg-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-7xl font-bold">25%</div>
                    <div className="text-2xl">OFF</div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 animate-pulse">
                  <Heart className="h-16 w-16 fill-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 animate-pulse" style={{ animationDelay: "0.5s" }}>
                  <Heart className="h-12 w-12 fill-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Included Services */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-primary sm:text-4xl">
              What's <span className="text-secondary">Included</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The 25% discount applies to ALL our services. No exclusions!
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            {includedServices.map((service) => (
              <Card key={service} className="border-0 bg-muted">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
                    <Check className="h-5 w-5 text-rose-500" />
                  </div>
                  <span className="font-medium">{service}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Redeem */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold text-primary sm:text-4xl">
                How to <span className="text-secondary">Redeem</span>
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-0 bg-card text-center">
                <CardContent className="p-6">
                  <div className="h-16 w-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-rose-500">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Book Online</h3>
                  <p className="text-sm text-muted-foreground">
                    Schedule your appointment through our website or call us directly.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-card text-center">
                <CardContent className="p-6">
                  <div className="h-16 w-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-rose-500">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Mention Promo</h3>
                  <p className="text-sm text-muted-foreground">
                    Let us know you're here for the Valentine's promotion when you visit.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-card text-center">
                <CardContent className="p-6">
                  <div className="h-16 w-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-rose-500">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Enjoy Savings</h3>
                  <p className="text-sm text-muted-foreground">
                    Get 25% off your treatment. It's that simple!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Terms */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 bg-muted">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Gift className="h-6 w-6 text-rose-500" />
                  <h3 className="text-lg font-semibold">Promotion Terms</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Valid from February 1 - 21, 2026</li>
                  <li>• Applies to all dental services</li>
                  <li>• Cannot be combined with other offers</li>
                  <li>• New and existing patients welcome</li>
                  <li>• Must book appointment within promotion period</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-pink-500 to-rose-500 text-white">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold sm:text-4xl">Don't Miss Out!</h2>
          <p className="text-white/90 max-w-2xl mx-auto">
            This Valentine's offer ends February 21st. Book your appointment now and save 25%.
          </p>
          <Button asChild size="lg" className="bg-white text-rose-500 hover:bg-white/90">
            <Link to="/book-appointment">Book Appointment Now</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Promotions;
