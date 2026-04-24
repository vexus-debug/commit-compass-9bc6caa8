import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "What services do you offer?",
  "How do I book an appointment?",
  "What are your opening hours?",
  "Do you accept insurance?",
];

export function FloatingAIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: msg };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      setMessages((p) => [
        ...p,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Thanks for asking about **"${msg}"**!\n\nOur team would be happy to help. You can book an appointment online or call us directly.\n\n_AI backend coming soon for live answers._`,
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <>
      {/* Pulsing robot head trigger - right side */}
      <AnimatePresence>
        {!open && (
          <motion.button
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-secondary text-secondary-foreground shadow-lg shadow-secondary/25 flex items-center justify-center hover:shadow-xl hover:shadow-secondary/30 hover:scale-110 transition-all duration-200"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Open AI Chat"
          >
            {/* Pulsing ring */}
            <span className="absolute inset-0 rounded-full bg-secondary/40 animate-ping" />
            <Bot className="h-7 w-7 relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Full-screen toggle panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-background flex flex-col"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/80 backdrop-blur-xl">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Vista AI</h2>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    <span className="text-[11px] text-secondary font-medium">Online</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-xl"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {isEmpty ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="h-20 w-20 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4">
                    <Bot className="h-10 w-10 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">How can I help?</h3>
                  <p className="text-sm text-muted-foreground max-w-[280px] mb-6">
                    Ask about our services, book appointments, or get quick answers.
                  </p>
                  <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSend(s)}
                        className="text-left text-xs px-3 py-2.5 rounded-xl border border-border/60 bg-card hover:bg-accent/50 hover:border-secondary/30 transition-all text-muted-foreground hover:text-foreground"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-w-2xl mx-auto">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {msg.role === "assistant" && (
                        <div className="h-7 w-7 rounded-lg bg-secondary/10 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                          <Bot className="h-3.5 w-3.5 text-secondary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-secondary text-secondary-foreground rounded-br-md"
                            : "bg-muted/60 text-foreground rounded-bl-md"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0 [&>p+p]:mt-1.5">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          msg.content
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="h-7 w-7 rounded-lg bg-secondary/10 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                        <Bot className="h-3.5 w-3.5 text-secondary animate-pulse" />
                      </div>
                      <div className="bg-muted/60 rounded-2xl rounded-bl-md px-4 py-2.5">
                        <div className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={endRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-4 pb-4 pt-2 max-w-2xl mx-auto w-full">
              <div className="flex items-end gap-1.5 bg-card border border-border/60 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-secondary/30 focus-within:border-secondary/50 transition-all">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none max-h-20 py-1.5"
                />
                <Button
                  size="icon"
                  className="h-8 w-8 rounded-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-sm"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-[9px] text-muted-foreground text-center mt-1.5">
                Powered by AI · Always verify clinical suggestions
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
