import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircle, Plus, Minus } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { useWebsiteFaqs } from "@/hooks/useWebsiteContent";

const fallbackFaqs = [
  { question: "What services do you offer?", answer: "We offer a comprehensive range of dental services." },
  { question: "How do I book an appointment?", answer: "You can book through our website or call us directly." },
];

export function FAQSection() {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [openItem, setOpenItem] = useState<string | undefined>("item-0");
  const { data: dbFaqs } = useWebsiteFaqs();

  const faqs = (dbFaqs && dbFaqs.length > 0) ? dbFaqs : fallbackFaqs;

  return (
    <section ref={ref} className="py-20 md:py-28 bg-muted relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-secondary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl" />

      <div className="container relative">
        <div className="grid lg:grid-cols-12 gap-12">
          <motion.div
            className="lg:col-span-4 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="relative inline-block">
              <motion.div
                className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <HelpCircle className="w-10 h-10 text-secondary" />
              </motion.div>
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            <h2 className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
              Frequently Asked{" "}
              <span className="text-secondary">Questions</span>
            </h2>

            <p className="text-muted-foreground text-lg">
              Find answers to common questions about our services, appointments, and what to expect during your visit.
            </p>

            <div className="pt-4">
              <Button asChild className="bg-secondary hover:bg-secondary/90 group">
                <Link to="/contact">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Still have questions?
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Accordion 
              type="single" 
              collapsible 
              value={openItem}
              onValueChange={setOpenItem}
              className="space-y-4"
            >
              {faqs.map((faq: any, index: number) => (
                <motion.div
                  key={faq.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <AccordionItem 
                    value={`item-${index}`}
                    className={`bg-card rounded-xl border-0 shadow-sm overflow-hidden transition-all duration-300 ${
                      openItem === `item-${index}` 
                        ? 'shadow-lg ring-2 ring-secondary/20' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    <AccordionTrigger className="px-6 py-5 hover:no-underline group">
                      <div className="flex items-center gap-4 text-left">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${
                          openItem === `item-${index}` 
                            ? 'bg-secondary text-secondary-foreground' 
                            : 'bg-secondary/10 text-secondary'
                        }`}>
                          {openItem === `item-${index}` ? (
                            <Minus className="w-5 h-5" />
                          ) : (
                            <Plus className="w-5 h-5" />
                          )}
                        </div>
                        <span className="font-semibold text-foreground group-hover:text-secondary transition-colors">
                          {faq.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-5">
                      <div className="pl-14 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
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