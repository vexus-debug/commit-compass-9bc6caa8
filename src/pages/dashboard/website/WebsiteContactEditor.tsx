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
import { Save, MapPin, Phone, Clock, Share2 } from "lucide-react";

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
    </div>
  );
}

export default function WebsiteContactEditor() {
  const { data: contactContent } = useWebsiteContent("contact");
  const { data: socialContent } = useWebsiteContent("social");

  return (
    <div className="space-y-6">
      <PageHeader title="Contact Page Editor" description="Edit contact information, working hours, and social media links" />
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="info" className="gap-1"><Phone className="h-3.5 w-3.5" />Contact Info</TabsTrigger>
          <TabsTrigger value="hours" className="gap-1"><Clock className="h-3.5 w-3.5" />Working Hours</TabsTrigger>
          <TabsTrigger value="location" className="gap-1"><MapPin className="h-3.5 w-3.5" />Location</TabsTrigger>
          <TabsTrigger value="social" className="gap-1"><Share2 className="h-3.5 w-3.5" />Social Media</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card><CardHeader><CardTitle className="text-lg">Contact Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="Page Title" sectionKey="contact_page_title" sectionGroup="contact" content={contactContent} />
              <ContentField label="Page Subtitle" sectionKey="contact_page_subtitle" sectionGroup="contact" content={contactContent} type="textarea" />
              <div className="grid grid-cols-2 gap-4">
                <ContentField label="Phone Number 1" sectionKey="clinic_phone_1" sectionGroup="contact" content={contactContent} />
                <ContentField label="Phone Number 2" sectionKey="clinic_phone_2" sectionGroup="contact" content={contactContent} />
              </div>
              <ContentField label="Email Address" sectionKey="clinic_email" sectionGroup="contact" content={contactContent} />
              <ContentField label="WhatsApp Number" sectionKey="clinic_whatsapp" sectionGroup="contact" content={contactContent} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card><CardHeader><CardTitle className="text-lg">Working Hours</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="Weekday Hours" sectionKey="clinic_hours_weekday" sectionGroup="contact" content={contactContent} />
              <ContentField label="Saturday Hours" sectionKey="clinic_hours_saturday" sectionGroup="contact" content={contactContent} />
              <ContentField label="Sunday Hours" sectionKey="clinic_hours_sunday" sectionGroup="contact" content={contactContent} />
              <ContentField label="Holiday Notice" sectionKey="clinic_hours_holiday" sectionGroup="contact" content={contactContent} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location">
          <Card><CardHeader><CardTitle className="text-lg">Location & Address</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="Full Address" sectionKey="clinic_address" sectionGroup="contact" content={contactContent} type="textarea" rows={3} />
              <ContentField label="Google Maps Embed URL" sectionKey="clinic_map_embed_url" sectionGroup="contact" content={contactContent} />
              <ContentField label="Google Maps Link" sectionKey="clinic_map_link" sectionGroup="contact" content={contactContent} />
              <ContentField label="Directions / Landmarks" sectionKey="clinic_directions" sectionGroup="contact" content={contactContent} type="textarea" rows={2} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card><CardHeader><CardTitle className="text-lg">Social Media Links</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="Instagram URL" sectionKey="instagram_url" sectionGroup="social" content={socialContent} />
              <ContentField label="Facebook URL" sectionKey="facebook_url" sectionGroup="social" content={socialContent} />
              <ContentField label="Twitter / X URL" sectionKey="twitter_url" sectionGroup="social" content={socialContent} />
              <ContentField label="TikTok URL" sectionKey="tiktok_url" sectionGroup="social" content={socialContent} />
              <ContentField label="YouTube URL" sectionKey="youtube_url" sectionGroup="social" content={socialContent} />
              <ContentField label="LinkedIn URL" sectionKey="linkedin_url" sectionGroup="social" content={socialContent} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
