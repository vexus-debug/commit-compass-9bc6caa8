import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What are your opening hours?",
        a: "We are open Monday to Saturday from 9:00 AM to 6:00 PM. We are closed on Sundays and public holidays.",
      },
      {
        q: "Where is your clinic located?",
        a: "We are located at Shop 221, Axis Plaza, Plot 678, Rachel T. Owolabi Close, Gaduwa, Abuja. The plaza is easily accessible from major roads in Gaduwa.",
      },
      {
        q: "Do I need to book an appointment?",
        a: "While walk-ins are welcome, we recommend booking an appointment to ensure you get a convenient time slot and minimize waiting time.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept cash, bank transfers, and major debit cards. Payment plans may be available for certain procedures.",
      },
    ],
  },
  {
    category: "Services",
    questions: [
      {
        q: "What services do you offer?",
        a: "We offer a comprehensive range of dental services including general check-ups, teeth cleaning, fillings, cosmetic dentistry, orthodontics, dental implants, oral surgery, root canal treatment, and gum disease treatment.",
      },
      {
        q: "How often should I visit the dentist?",
        a: "We recommend visiting the dentist at least twice a year for routine check-ups and professional cleaning. However, if you have specific dental concerns, you may need more frequent visits.",
      },
      {
        q: "Is teeth whitening safe?",
        a: "Yes, professional teeth whitening is safe when performed by dental professionals. We use approved products and techniques to ensure your safety and comfort.",
      },
      {
        q: "How long do dental implants last?",
        a: "With proper care and maintenance, dental implants can last a lifetime. They are designed to be a permanent solution for missing teeth.",
      },
    ],
  },
  {
    category: "Appointments",
    questions: [
      {
        q: "How do I book an appointment?",
        a: "You can book an appointment by calling us at 070 8878 8880 or 090 7776 6681, sending an email to Vista.dcs@gmail.com, or filling out the booking form on our website.",
      },
      {
        q: "Can I reschedule my appointment?",
        a: "Yes, you can reschedule your appointment. Please give us at least 24 hours notice so we can accommodate other patients.",
      },
      {
        q: "What should I bring to my first appointment?",
        a: "Please bring a valid ID and any previous dental records or X-rays if available. If you have dental insurance, bring your insurance information.",
      },
      {
        q: "Do you handle dental emergencies?",
        a: "Yes, we handle dental emergencies. If you're experiencing severe pain, swelling, or a dental injury, please call us immediately and we'll do our best to see you the same day.",
      },
    ],
  },
  {
    category: "Pricing",
    questions: [
      {
        q: "How much do your services cost?",
        a: "Costs vary depending on the treatment needed. We provide transparent pricing and will give you a detailed quote before any treatment. Contact us for specific pricing information.",
      },
      {
        q: "Do you offer payment plans?",
        a: "Yes, we offer payment plans for certain procedures. Please speak with our team to discuss your options.",
      },
      {
        q: "Do you accept dental insurance?",
        a: "We work with various insurance providers. Please contact us with your insurance details and we'll help you understand your coverage.",
      },
    ],
  },
];

const FAQ = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-dental-teal-pale via-background to-dental-mint">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold text-primary sm:text-5xl">
              Frequently Asked <span className="text-secondary">Questions</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about our services, appointments, and more.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-12">
            {faqs.map((category) => (
              <div key={category.category}>
                <h2 className="text-2xl font-bold text-primary mb-6">{category.category}</h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`${category.category}-${index}`}
                      className="border rounded-lg px-4 bg-muted"
                    >
                      <AccordionTrigger className="text-left hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold text-primary">Still Have Questions?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Can't find the answer you're looking for? Feel free to contact us and we'll be happy to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="tel:07088788880">Call Us</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
