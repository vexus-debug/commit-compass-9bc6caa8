import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Rocket, User, UserPlus, CalendarPlus, Footprints, Stethoscope, Activity,
  FileText, CreditCard, BarChart3, Package, UserCog, Settings, FlaskConical,
  CheckCircle2, Circle, BookOpen, ArrowRight, GraduationCap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getRoleLabel } from "@/config/roleAccess";
import { getTutorialsForRole, type Tutorial } from "@/data/tutorialData";
import { Link } from "react-router-dom";

const iconMap: Record<string, React.ElementType> = {
  rocket: Rocket,
  user: User,
  "user-plus": UserPlus,
  "calendar-plus": CalendarPlus,
  footprints: Footprints,
  stethoscope: Stethoscope,
  activity: Activity,
  "file-text": FileText,
  "credit-card": CreditCard,
  "bar-chart": BarChart3,
  package: Package,
  "users-cog": UserCog,
  settings: Settings,
  flask: FlaskConical,
};

function useTutorialProgress() {
  const storageKey = "tutorial-progress";

  const getProgress = (): Record<string, number[]> => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch {
      return {};
    }
  };

  const [progress, setProgress] = useState<Record<string, number[]>>(getProgress);

  const toggleStep = (tutorialId: string, stepIndex: number) => {
    setProgress((prev) => {
      const completed = prev[tutorialId] || [];
      const next = completed.includes(stepIndex)
        ? completed.filter((i) => i !== stepIndex)
        : [...completed, stepIndex];
      const updated = { ...prev, [tutorialId]: next };
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  };

  const getCompleted = (tutorialId: string) => progress[tutorialId] || [];

  return { getCompleted, toggleStep };
}

export default function TutorialsPage() {
  const { roles } = useAuth();
  const primaryRole = roles[0] || "staff";
  const roleTutorials = getTutorialsForRole(primaryRole);
  const { getCompleted, toggleStep } = useTutorialProgress();

  const totalSteps = roleTutorials.reduce((sum, t) => sum + t.steps.length, 0);
  const completedSteps = roleTutorials.reduce(
    (sum, t) => sum + getCompleted(t.id).length,
    0
  );
  const overallPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-secondary" />
            <h1 className="text-2xl font-bold text-foreground">Tutorials</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Step-by-step guides tailored for your role as{" "}
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-1">
              {getRoleLabel(primaryRole)}
            </Badge>
          </p>
        </div>
        <div className="flex items-center gap-3 bg-card border rounded-lg px-4 py-3 min-w-[200px]">
          <BookOpen className="h-5 w-5 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-muted-foreground">Overall Progress</span>
              <span className="text-xs font-bold text-secondary">{overallPercent}%</span>
            </div>
            <Progress value={overallPercent} className="h-2" />
          </div>
        </div>
      </div>

      {/* Tutorial Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {roleTutorials.map((tutorial) => (
          <TutorialCard
            key={tutorial.id}
            tutorial={tutorial}
            completed={getCompleted(tutorial.id)}
            onToggleStep={(stepIndex) => toggleStep(tutorial.id, stepIndex)}
          />
        ))}
      </div>

      {roleTutorials.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <GraduationCap className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No tutorials available for your role yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TutorialCard({
  tutorial,
  completed,
  onToggleStep,
}: {
  tutorial: Tutorial;
  completed: number[];
  onToggleStep: (stepIndex: number) => void;
}) {
  const Icon = iconMap[tutorial.icon] || BookOpen;
  const percent = Math.round((completed.length / tutorial.steps.length) * 100);
  const isDone = completed.length === tutorial.steps.length;

  return (
    <Card className={`transition-all ${isDone ? "border-emerald-200 bg-emerald-50/30 dark:border-emerald-900 dark:bg-emerald-950/20" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${isDone ? "bg-emerald-100 dark:bg-emerald-900/40" : "bg-secondary/10"}`}>
              <Icon className={`h-5 w-5 ${isDone ? "text-emerald-600 dark:text-emerald-400" : "text-secondary"}`} />
            </div>
            <div>
              <CardTitle className="text-sm">{tutorial.title}</CardTitle>
              <CardDescription className="text-xs mt-0.5">{tutorial.description}</CardDescription>
            </div>
          </div>
          {isDone && (
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 shrink-0">
              Complete
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Progress value={percent} className="h-1.5 flex-1" />
          <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
            {completed.length}/{tutorial.steps.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion type="single" collapsible>
          <AccordionItem value="steps" className="border-0">
            <AccordionTrigger className="py-2 text-xs font-medium text-muted-foreground hover:no-underline">
              View Steps
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {tutorial.steps.map((step, i) => {
                  const isComplete = completed.includes(i);
                  return (
                    <button
                      key={i}
                      onClick={() => onToggleStep(i)}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-md text-left transition-colors ${
                        isComplete
                          ? "bg-emerald-50 dark:bg-emerald-950/20"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={`text-sm font-medium leading-tight ${isComplete ? "line-through text-muted-foreground" : ""}`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              {tutorial.pageLink && (
                <Button variant="ghost" size="sm" className="mt-3 w-full text-secondary" asChild>
                  <Link to={tutorial.pageLink}>
                    Go to {tutorial.title.split(" ").slice(-1)[0]} Page
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Link>
                </Button>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
