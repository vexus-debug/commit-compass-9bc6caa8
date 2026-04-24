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
import { Save, LayoutTemplate, PanelBottom, Megaphone, Image } from "lucide-react";

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

export default function WebsiteHeaderFooterEditor() {
  const { data: headerContent } = useWebsiteContent("header");
  const { data: footerContent } = useWebsiteContent("footer");
  const { data: promoContent } = useWebsiteContent("promo_banner");
  const { data: generalContent } = useWebsiteContent("general");

  return (
    <div className="space-y-6">
      <PageHeader title="Header, Footer & Branding" description="Edit the website header, footer, promo banner, and branding" />
      <Tabs defaultValue="branding" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="branding" className="gap-1"><Image className="h-3.5 w-3.5" />Branding</TabsTrigger>
          <TabsTrigger value="header" className="gap-1"><LayoutTemplate className="h-3.5 w-3.5" />Header</TabsTrigger>
          <TabsTrigger value="promo" className="gap-1"><Megaphone className="h-3.5 w-3.5" />Promo Banner</TabsTrigger>
          <TabsTrigger value="footer" className="gap-1"><PanelBottom className="h-3.5 w-3.5" />Footer</TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          <Card><CardHeader><CardTitle className="text-lg">Branding & General</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="Clinic Name" sectionKey="clinic_name" sectionGroup="general" content={generalContent} />
              <ContentField label="Clinic Tagline" sectionKey="clinic_tagline" sectionGroup="general" content={generalContent} />
              <ContentField label="Logo URL" sectionKey="clinic_logo_url" sectionGroup="general" content={generalContent} type="image" />
              <ContentField label="Favicon URL" sectionKey="clinic_favicon_url" sectionGroup="general" content={generalContent} type="image" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="header">
          <Card><CardHeader><CardTitle className="text-lg">Header / Navigation</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="Book Appointment Button Text" sectionKey="header_cta_text" sectionGroup="header" content={headerContent} />
              <ContentField label="Header Phone Display" sectionKey="header_phone_display" sectionGroup="header" content={headerContent} />
              <ContentField label="Header Email Display" sectionKey="header_email_display" sectionGroup="header" content={headerContent} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promo">
          <Card><CardHeader><CardTitle className="text-lg">Promotional Banner</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="Banner Enabled (true/false)" sectionKey="promo_banner_enabled" sectionGroup="promo_banner" content={promoContent} />
              <ContentField label="Banner Text" sectionKey="promo_banner_text" sectionGroup="promo_banner" content={promoContent} />
              <ContentField label="Banner Link Text" sectionKey="promo_banner_link_text" sectionGroup="promo_banner" content={promoContent} />
              <ContentField label="Banner Link URL" sectionKey="promo_banner_link_url" sectionGroup="promo_banner" content={promoContent} />
              <ContentField label="Banner Background Color (CSS)" sectionKey="promo_banner_bg_color" sectionGroup="promo_banner" content={promoContent} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer">
          <Card><CardHeader><CardTitle className="text-lg">Footer</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="Footer Tagline" sectionKey="footer_tagline" sectionGroup="footer" content={footerContent} type="textarea" rows={3} />
              <ContentField label="Copyright Text" sectionKey="footer_copyright" sectionGroup="footer" content={footerContent} />
              <ContentField label="Quick Links Section Title" sectionKey="footer_quicklinks_title" sectionGroup="footer" content={footerContent} />
              <ContentField label="Services Section Title" sectionKey="footer_services_title" sectionGroup="footer" content={footerContent} />
              <ContentField label="Contact Section Title" sectionKey="footer_contact_title" sectionGroup="footer" content={footerContent} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
