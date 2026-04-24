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
import { Save, Home, Sparkles, Heart, MapPin, BarChart3, Zap, MessageSquare, Phone } from "lucide-react";

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
      {type === "textarea" ? (
        <Textarea value={value} onChange={(e) => handleChange(e.target.value)} rows={rows} className="text-sm" />
      ) : (
        <Input value={value} onChange={(e) => handleChange(e.target.value)} className="text-sm" />
      )}
      {type === "image" && value && <img src={value} alt="" className="h-16 w-24 object-cover rounded mt-1" />}
    </div>
  );
}

export default function WebsiteHomeEditor() {
  const { data: heroContent } = useWebsiteContent("hero");
  const { data: aboutContent } = useWebsiteContent("home_about");
  const { data: servicesContent } = useWebsiteContent("home_services");
  const { data: whyContent } = useWebsiteContent("home_why_choose");
  const { data: processContent } = useWebsiteContent("home_process");
  const { data: ctaContent } = useWebsiteContent("home_cta");
  const { data: locationContent } = useWebsiteContent("home_location");
  const { data: statsContent } = useWebsiteContent("home_stats");

  return (
    <div className="space-y-6">
      <PageHeader title="Home Page Editor" description="Edit all sections of your homepage" />

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="hero" className="gap-1"><Sparkles className="h-3.5 w-3.5" />Hero</TabsTrigger>
          <TabsTrigger value="about" className="gap-1"><Home className="h-3.5 w-3.5" />About Preview</TabsTrigger>
          <TabsTrigger value="services" className="gap-1"><Heart className="h-3.5 w-3.5" />Services</TabsTrigger>
          <TabsTrigger value="whychoose" className="gap-1"><Zap className="h-3.5 w-3.5" />Why Choose Us</TabsTrigger>
          <TabsTrigger value="process" className="gap-1"><BarChart3 className="h-3.5 w-3.5" />Process</TabsTrigger>
          <TabsTrigger value="stats" className="gap-1"><BarChart3 className="h-3.5 w-3.5" />Stats</TabsTrigger>
          <TabsTrigger value="location" className="gap-1"><MapPin className="h-3.5 w-3.5" />Location</TabsTrigger>
          <TabsTrigger value="cta" className="gap-1"><MessageSquare className="h-3.5 w-3.5" />CTA</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader><CardTitle className="text-lg">Hero Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="Badge Text" sectionKey="hero_badge" sectionGroup="hero" content={heroContent} />
              <ContentField label="Heading Prefix" sectionKey="hero_heading_prefix" sectionGroup="hero" content={heroContent} />
              <ContentField label="Rotating Words (comma-separated)" sectionKey="hero_rotating_words" sectionGroup="hero" content={heroContent} />
              <ContentField label="Description" sectionKey="hero_description" sectionGroup="hero" content={heroContent} type="textarea" rows={3} />
              <div className="grid grid-cols-2 gap-4">
                <ContentField label="Primary CTA Text" sectionKey="hero_cta_primary" sectionGroup="hero" content={heroContent} />
                <ContentField label="Secondary CTA Text" sectionKey="hero_cta_secondary" sectionGroup="hero" content={heroContent} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <ContentField label="Badge 1 (e.g. 5-Star)" sectionKey="hero_badge_1" sectionGroup="hero" content={heroContent} />
                <ContentField label="Badge 2 (e.g. Patients)" sectionKey="hero_badge_2" sectionGroup="hero" content={heroContent} />
                <ContentField label="Badge 3 (e.g. Experience)" sectionKey="hero_badge_3" sectionGroup="hero" content={heroContent} />
              </div>
              <ContentField label="Hero Image URL" sectionKey="hero_image_url" sectionGroup="hero" content={heroContent} type="image" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader><CardTitle className="text-lg">About Preview Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="Section Badge" sectionKey="home_about_badge" sectionGroup="home_about" content={aboutContent} />
              <ContentField label="Section Title" sectionKey="home_about_title" sectionGroup="home_about" content={aboutContent} />
              <ContentField label="Description" sectionKey="home_about_description" sectionGroup="home_about" content={aboutContent} type="textarea" rows={4} />
              <ContentField label="Image URL" sectionKey="home_about_image" sectionGroup="home_about" content={aboutContent} type="image" />
              <ContentField label="CTA Button Text" sectionKey="home_about_cta" sectionGroup="home_about" content={aboutContent} />
              <div className="grid grid-cols-2 gap-4">
                <ContentField label="Highlight 1" sectionKey="home_about_highlight_1" sectionGroup="home_about" content={aboutContent} />
                <ContentField label="Highlight 2" sectionKey="home_about_highlight_2" sectionGroup="home_about" content={aboutContent} />
                <ContentField label="Highlight 3" sectionKey="home_about_highlight_3" sectionGroup="home_about" content={aboutContent} />
                <ContentField label="Highlight 4" sectionKey="home_about_highlight_4" sectionGroup="home_about" content={aboutContent} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader><CardTitle className="text-lg">Services Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="Section Badge" sectionKey="home_services_badge" sectionGroup="home_services" content={servicesContent} />
              <ContentField label="Section Title" sectionKey="home_services_title" sectionGroup="home_services" content={servicesContent} />
              <ContentField label="Section Subtitle" sectionKey="home_services_subtitle" sectionGroup="home_services" content={servicesContent} type="textarea" />
              <ContentField label="CTA Text" sectionKey="home_services_cta" sectionGroup="home_services" content={servicesContent} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whychoose">
          <Card>
            <CardHeader><CardTitle className="text-lg">Why Choose Us Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="Section Title" sectionKey="home_why_title" sectionGroup="home_why_choose" content={whyContent} />
              <ContentField label="Section Subtitle" sectionKey="home_why_subtitle" sectionGroup="home_why_choose" content={whyContent} type="textarea" />
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="p-3 rounded-lg border space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Feature {i}</p>
                  <ContentField label={`Title`} sectionKey={`home_why_feature_${i}_title`} sectionGroup="home_why_choose" content={whyContent} />
                  <ContentField label={`Description`} sectionKey={`home_why_feature_${i}_desc`} sectionGroup="home_why_choose" content={whyContent} type="textarea" rows={2} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="process">
          <Card>
            <CardHeader><CardTitle className="text-lg">Treatment Process Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="Section Title" sectionKey="home_process_title" sectionGroup="home_process" content={processContent} />
              <ContentField label="Section Subtitle" sectionKey="home_process_subtitle" sectionGroup="home_process" content={processContent} type="textarea" />
              {[1,2,3,4].map(i => (
                <div key={i} className="p-3 rounded-lg border space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Step {i}</p>
                  <ContentField label={`Title`} sectionKey={`home_process_step_${i}_title`} sectionGroup="home_process" content={processContent} />
                  <ContentField label={`Description`} sectionKey={`home_process_step_${i}_desc`} sectionGroup="home_process" content={processContent} type="textarea" rows={2} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader><CardTitle className="text-lg">Stats / Numbers Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="grid grid-cols-3 gap-3 p-3 rounded-lg border">
                  <ContentField label={`Stat ${i} Number`} sectionKey={`home_stat_${i}_number`} sectionGroup="home_stats" content={statsContent} />
                  <ContentField label={`Stat ${i} Suffix`} sectionKey={`home_stat_${i}_suffix`} sectionGroup="home_stats" content={statsContent} />
                  <ContentField label={`Stat ${i} Label`} sectionKey={`home_stat_${i}_label`} sectionGroup="home_stats" content={statsContent} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location">
          <Card>
            <CardHeader><CardTitle className="text-lg">Location Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="Section Title" sectionKey="home_location_title" sectionGroup="home_location" content={locationContent} />
              <ContentField label="Section Subtitle" sectionKey="home_location_subtitle" sectionGroup="home_location" content={locationContent} type="textarea" />
              <ContentField label="Google Maps Embed URL" sectionKey="home_location_map_url" sectionGroup="home_location" content={locationContent} />
              <ContentField label="Address" sectionKey="home_location_address" sectionGroup="home_location" content={locationContent} type="textarea" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cta">
          <Card>
            <CardHeader><CardTitle className="text-lg">Call to Action Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="CTA Title" sectionKey="home_cta_title" sectionGroup="home_cta" content={ctaContent} />
              <ContentField label="CTA Description" sectionKey="home_cta_description" sectionGroup="home_cta" content={ctaContent} type="textarea" rows={3} />
              <ContentField label="Primary Button Text" sectionKey="home_cta_button_primary" sectionGroup="home_cta" content={ctaContent} />
              <ContentField label="Secondary Button Text" sectionKey="home_cta_button_secondary" sectionGroup="home_cta" content={ctaContent} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
