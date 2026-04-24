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
import { Save, Sparkles, Target, BookOpen, Heart, Building2, Phone } from "lucide-react";

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

export default function WebsiteAboutEditor() {
  const { data: heroContent } = useWebsiteContent("about_hero");
  const { data: storyContent } = useWebsiteContent("about_story");
  const { data: missionContent } = useWebsiteContent("about_mission");
  const { data: valuesContent } = useWebsiteContent("about_values");
  const { data: facilitiesContent } = useWebsiteContent("about_facilities");
  const { data: ctaContent } = useWebsiteContent("about_cta");

  return (
    <div className="space-y-6">
      <PageHeader title="About Page Editor" description="Edit all sections of the About Us page" />
      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="hero" className="gap-1"><Sparkles className="h-3.5 w-3.5" />Hero</TabsTrigger>
          <TabsTrigger value="story" className="gap-1"><BookOpen className="h-3.5 w-3.5" />Our Story</TabsTrigger>
          <TabsTrigger value="mission" className="gap-1"><Target className="h-3.5 w-3.5" />Mission & Vision</TabsTrigger>
          <TabsTrigger value="values" className="gap-1"><Heart className="h-3.5 w-3.5" />Values</TabsTrigger>
          <TabsTrigger value="facilities" className="gap-1"><Building2 className="h-3.5 w-3.5" />Facilities</TabsTrigger>
          <TabsTrigger value="cta" className="gap-1"><Phone className="h-3.5 w-3.5" />CTA</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card><CardHeader><CardTitle className="text-lg">About Hero</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="Page Title" sectionKey="about_hero_title" sectionGroup="about_hero" content={heroContent} />
              <ContentField label="Subtitle" sectionKey="about_hero_subtitle" sectionGroup="about_hero" content={heroContent} type="textarea" rows={3} />
              <ContentField label="Hero Image URL" sectionKey="about_hero_image" sectionGroup="about_hero" content={heroContent} type="image" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="story">
          <Card><CardHeader><CardTitle className="text-lg">Our Story Timeline</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="Section Title" sectionKey="about_story_title" sectionGroup="about_story" content={storyContent} />
              <ContentField label="Section Subtitle" sectionKey="about_story_subtitle" sectionGroup="about_story" content={storyContent} type="textarea" />
              {[1,2,3,4].map(i => (
                <div key={i} className="p-3 rounded-lg border space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Timeline Item {i}</p>
                  <ContentField label="Year" sectionKey={`about_story_${i}_year`} sectionGroup="about_story" content={storyContent} />
                  <ContentField label="Title" sectionKey={`about_story_${i}_title`} sectionGroup="about_story" content={storyContent} />
                  <ContentField label="Description" sectionKey={`about_story_${i}_desc`} sectionGroup="about_story" content={storyContent} type="textarea" rows={2} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mission">
          <Card><CardHeader><CardTitle className="text-lg">Mission & Vision</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="Mission Title" sectionKey="about_mission_title" sectionGroup="about_mission" content={missionContent} />
              <ContentField label="Mission Statement" sectionKey="about_mission_text" sectionGroup="about_mission" content={missionContent} type="textarea" rows={4} />
              <ContentField label="Vision Title" sectionKey="about_vision_title" sectionGroup="about_mission" content={missionContent} />
              <ContentField label="Vision Statement" sectionKey="about_vision_text" sectionGroup="about_mission" content={missionContent} type="textarea" rows={4} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="values">
          <Card><CardHeader><CardTitle className="text-lg">Core Values</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="Section Title" sectionKey="about_values_title" sectionGroup="about_values" content={valuesContent} />
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="grid grid-cols-2 gap-3 p-3 rounded-lg border">
                  <ContentField label={`Value ${i} Title`} sectionKey={`about_value_${i}_title`} sectionGroup="about_values" content={valuesContent} />
                  <ContentField label={`Value ${i} Description`} sectionKey={`about_value_${i}_desc`} sectionGroup="about_values" content={valuesContent} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities">
          <Card><CardHeader><CardTitle className="text-lg">Facilities</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="Section Title" sectionKey="about_facilities_title" sectionGroup="about_facilities" content={facilitiesContent} />
              <ContentField label="Section Description" sectionKey="about_facilities_desc" sectionGroup="about_facilities" content={facilitiesContent} type="textarea" />
              {[1,2,3,4].map(i => (
                <div key={i} className="p-3 rounded-lg border space-y-2">
                  <ContentField label={`Facility ${i} Title`} sectionKey={`about_facility_${i}_title`} sectionGroup="about_facilities" content={facilitiesContent} />
                  <ContentField label={`Facility ${i} Description`} sectionKey={`about_facility_${i}_desc`} sectionGroup="about_facilities" content={facilitiesContent} type="textarea" rows={2} />
                  <ContentField label={`Facility ${i} Image`} sectionKey={`about_facility_${i}_image`} sectionGroup="about_facilities" content={facilitiesContent} type="image" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cta">
          <Card><CardHeader><CardTitle className="text-lg">About CTA Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="CTA Title" sectionKey="about_cta_title" sectionGroup="about_cta" content={ctaContent} />
              <ContentField label="CTA Description" sectionKey="about_cta_description" sectionGroup="about_cta" content={ctaContent} type="textarea" rows={3} />
              <ContentField label="Button Text" sectionKey="about_cta_button" sectionGroup="about_cta" content={ctaContent} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
