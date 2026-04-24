import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useWebsiteContent, useUpsertContent, getContent } from "@/hooks/useWebsiteContent";
import { toast } from "sonner";
import { Save, Sparkles, Stethoscope, BarChart3 } from "lucide-react";

function ContentField({ label, sectionKey, sectionGroup, content, type = "text", rows = 2 }: {
  label: string; sectionKey: string; sectionGroup: string; content: any[] | undefined; type?: "text" | "textarea" | "image"; rows?: number;
}) {
  const upsert = useUpsertContent();
  const current = getContent(content, sectionKey, "");
  const [value, setValue] = useState(current);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (current) { setValue(current); setDirty(false); } }, [current]);
  const handleChange = (v: string) => { setValue(v); setDirty(v !== current); };
  const handleSave = () => {
    upsert.mutate({ section_key: sectionKey, content_value: value, content_type: type === "image" ? "image" : "text", section_group: sectionGroup, label }, {
      onSuccess: () => { toast.success(`${label} saved`); setDirty(false); },
      onError: (e) => toast.error(e.message),
    });
  };
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {dirty && <Button size="sm" variant="outline" className="h-7 text-xs" onClick={handleSave} disabled={upsert.isPending}><Save className="h-3 w-3 mr-1" />Save</Button>}
      </div>
      {type === "textarea" ? <Textarea value={value} onChange={(e) => handleChange(e.target.value)} rows={rows} className="text-sm" /> : <Input value={value} onChange={(e) => handleChange(e.target.value)} className="text-sm" />}
      {type === "image" && value && <img src={value} alt="" className="h-16 w-24 object-cover rounded mt-1" />}
    </div>
  );
}

const SERVICE_SLUGS = [
  { key: "general_preventive", label: "General & Preventive Dentistry" },
  { key: "cosmetic", label: "Cosmetic Dentistry" },
  { key: "orthodontics", label: "Orthodontics" },
  { key: "restorative", label: "Restorative & Prosthodontics" },
  { key: "implants", label: "Dental Implants" },
  { key: "oral_surgery", label: "Oral Surgery" },
  { key: "periodontics", label: "Gum Treatment & Root Canal" },
];

export default function WebsiteServicesEditor() {
  const { data: heroContent } = useWebsiteContent("services_hero");
  const { data: pageContent } = useWebsiteContent("services_page");

  return (
    <div className="space-y-6">
      <PageHeader title="Services Page Editor" description="Edit the main services page and individual service details" />
      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="hero" className="gap-1"><Sparkles className="h-3.5 w-3.5" />Hero</TabsTrigger>
          <TabsTrigger value="stats" className="gap-1"><BarChart3 className="h-3.5 w-3.5" />Stats</TabsTrigger>
          <TabsTrigger value="services" className="gap-1"><Stethoscope className="h-3.5 w-3.5" />Service Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card><CardHeader><CardTitle className="text-lg">Services Hero Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="Badge Text" sectionKey="services_hero_badge" sectionGroup="services_hero" content={heroContent} />
              <ContentField label="Page Title" sectionKey="services_hero_title" sectionGroup="services_hero" content={heroContent} />
              <ContentField label="Subtitle" sectionKey="services_hero_subtitle" sectionGroup="services_hero" content={heroContent} type="textarea" rows={3} />
              <ContentField label="Primary CTA Text" sectionKey="services_hero_cta_primary" sectionGroup="services_hero" content={heroContent} />
              <ContentField label="Secondary CTA Text" sectionKey="services_hero_cta_secondary" sectionGroup="services_hero" content={heroContent} />
              <ContentField label="Background Image URL" sectionKey="services_hero_bg_image" sectionGroup="services_hero" content={heroContent} type="image" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card><CardHeader><CardTitle className="text-lg">Stats Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="Stats Section Title" sectionKey="services_stats_title" sectionGroup="services_page" content={pageContent} />
              {[1,2,3,4].map(i => (
                <div key={i} className="grid grid-cols-3 gap-3 p-3 rounded-lg border">
                  <ContentField label={`Stat ${i} Number`} sectionKey={`services_stat_${i}_number`} sectionGroup="services_page" content={pageContent} />
                  <ContentField label={`Suffix`} sectionKey={`services_stat_${i}_suffix`} sectionGroup="services_page" content={pageContent} />
                  <ContentField label={`Label`} sectionKey={`services_stat_${i}_label`} sectionGroup="services_page" content={pageContent} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card><CardHeader><CardTitle className="text-lg">Individual Service Cards</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Edit the title and description for each service card shown on the services page.</p>
              {SERVICE_SLUGS.map(s => (
                <div key={s.key} className="p-4 rounded-lg border space-y-3">
                  <p className="text-sm font-semibold text-primary">{s.label}</p>
                  <ContentField label="Card Title" sectionKey={`service_card_${s.key}_title`} sectionGroup="services_page" content={pageContent} />
                  <ContentField label="Card Description" sectionKey={`service_card_${s.key}_desc`} sectionGroup="services_page" content={pageContent} type="textarea" rows={2} />
                  <ContentField label="Card Image URL" sectionKey={`service_card_${s.key}_image`} sectionGroup="services_page" content={pageContent} type="image" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
