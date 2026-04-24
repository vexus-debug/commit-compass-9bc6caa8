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
import { Save, Search, Globe, Home, Info, Stethoscope, Phone } from "lucide-react";

function ContentField({ label, sectionKey, sectionGroup, content, type = "text", rows = 2, placeholder = "" }: {
  label: string; sectionKey: string; sectionGroup: string; content: any[] | undefined; type?: "text" | "textarea"; rows?: number; placeholder?: string;
}) {
  const upsert = useUpsertContent();
  const current = getContent(content, sectionKey, "");
  const [value, setValue] = useState(current);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (current) { setValue(current); setDirty(false); } }, [current]);
  const handleChange = (v: string) => { setValue(v); setDirty(v !== current); };
  const handleSave = () => {
    upsert.mutate({ section_key: sectionKey, content_value: value, content_type: "text", section_group: sectionGroup, label }, {
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
      {type === "textarea" ? <Textarea value={value} onChange={(e) => handleChange(e.target.value)} rows={rows} className="text-sm" placeholder={placeholder} /> : <Input value={value} onChange={(e) => handleChange(e.target.value)} className="text-sm" placeholder={placeholder} />}
    </div>
  );
}

const PAGES = [
  { key: "home", label: "Home Page", icon: Home },
  { key: "about", label: "About Page", icon: Info },
  { key: "services", label: "Services Page", icon: Stethoscope },
  { key: "contact", label: "Contact Page", icon: Phone },
];

export default function WebsiteSeoEditor() {
  const { data: seoContent } = useWebsiteContent("seo");

  return (
    <div className="space-y-6">
      <PageHeader title="SEO & Meta Tags" description="Manage search engine optimization settings for each page" />

      <Tabs defaultValue="global" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="global" className="gap-1"><Globe className="h-3.5 w-3.5" />Global</TabsTrigger>
          {PAGES.map(p => (
            <TabsTrigger key={p.key} value={p.key} className="gap-1"><p.icon className="h-3.5 w-3.5" />{p.label}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="global">
          <Card><CardHeader><CardTitle className="text-lg">Global SEO Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ContentField label="Site Title Suffix" sectionKey="seo_site_title_suffix" sectionGroup="seo" content={seoContent} placeholder="| Vista Dental Care" />
              <ContentField label="Default Meta Description" sectionKey="seo_default_description" sectionGroup="seo" content={seoContent} type="textarea" rows={3} placeholder="Vista Dental Care offers..." />
              <ContentField label="Default Meta Keywords" sectionKey="seo_default_keywords" sectionGroup="seo" content={seoContent} type="textarea" rows={2} placeholder="dentist abuja, dental care..." />
              <ContentField label="OG Image URL" sectionKey="seo_og_image" sectionGroup="seo" content={seoContent} placeholder="https://..." />
              <ContentField label="Google Analytics ID" sectionKey="seo_ga_id" sectionGroup="seo" content={seoContent} placeholder="G-XXXXXXXXXX" />
              <ContentField label="Schema.org JSON-LD (Business)" sectionKey="seo_jsonld" sectionGroup="seo" content={seoContent} type="textarea" rows={6} />
            </CardContent>
          </Card>
        </TabsContent>

        {PAGES.map(p => (
          <TabsContent key={p.key} value={p.key}>
            <Card><CardHeader><CardTitle className="text-lg">{p.label} SEO</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <ContentField label="Page Title" sectionKey={`seo_${p.key}_title`} sectionGroup="seo" content={seoContent} placeholder={`${p.label} | Vista Dental Care`} />
                <ContentField label="Meta Description" sectionKey={`seo_${p.key}_description`} sectionGroup="seo" content={seoContent} type="textarea" rows={3} />
                <ContentField label="Meta Keywords" sectionKey={`seo_${p.key}_keywords`} sectionGroup="seo" content={seoContent} type="textarea" rows={2} />
                <ContentField label="OG Title" sectionKey={`seo_${p.key}_og_title`} sectionGroup="seo" content={seoContent} />
                <ContentField label="OG Description" sectionKey={`seo_${p.key}_og_description`} sectionGroup="seo" content={seoContent} type="textarea" rows={2} />
                <ContentField label="Canonical URL" sectionKey={`seo_${p.key}_canonical`} sectionGroup="seo" content={seoContent} placeholder="https://vistadentalcare.com/..." />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
