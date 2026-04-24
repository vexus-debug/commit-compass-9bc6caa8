import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface FAQItem {
  question: string;
  answer: string;
}

interface ServiceFAQProps {
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
}

export function ServiceFAQ({ 
  title = "Frequently Asked Questions",
  subtitle = "Got Questions?",
  faqs 
}: ServiceFAQProps) {
  return (
    <section className="py-20 md:py-28 bg-card relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Left Side - Header */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary font-medium">
              <HelpCircle className="h-4 w-4" />
              {subtitle}
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              {title}
            </h2>
            
            <p className="text-muted-foreground">
              Find answers to common questions about this treatment. If you don't see your question here, feel free to contact us.
            </p>

            <div className="pt-4">
              <Button asChild variant="outline" className="group">
                <Link to="/contact">
                  <MessageCircle className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Still Have Questions?
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right Side - Accordion */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <AccordionItem 
                    value={`item-${index}`} 
                    className="border border-border rounded-xl px-6 bg-background shadow-sm hover:shadow-md transition-shadow data-[state=open]:shadow-md data-[state=open]:border-secondary/30"
                  >
                    <AccordionTrigger className="text-left font-semibold text-primary hover:text-secondary hover:no-underline py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
