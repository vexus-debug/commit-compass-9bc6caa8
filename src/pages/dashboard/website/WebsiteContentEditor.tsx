import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useWebsiteContent, useUpsertContent, useDeleteContent } from "@/hooks/useWebsiteContent";
import { toast } from "sonner";
import { Save, Plus, Trash2, Search, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SECTION_GROUPS = [
  { value: "home_hero", label: "Home — Hero" },
  { value: "home_about", label: "Home — About Preview" },
  { value: "home_services", label: "Home — Services" },
  { value: "home_why_choose", label: "Home — Why Choose Us" },
  { value: "home_process", label: "Home — Treatment Process" },
  { value: "home_cta", label: "Home — CTA" },
  { value: "home_location", label: "Home — Location" },
  { value: "home_stats", label: "Home — Stats" },
  { value: "about_hero", label: "About — Hero" },
  { value: "about_story", label: "About — Story" },
  { value: "about_mission", label: "About — Mission & Vision" },
  { value: "about_values", label: "About — Values" },
  { value: "about_facilities", label: "About — Facilities" },
  { value: "services_hero", label: "Services — Hero" },
  { value: "services_page", label: "Services — Page Content" },
  { value: "contact_info", label: "Contact — Info" },
  { value: "contact_social", label: "Contact — Social Media" },
  { value: "header", label: "Header / Navigation" },
  { value: "footer", label: "Footer" },
  { value: "promo_banner", label: "Promo Banner" },
  { value: "seo", label: "SEO / Meta" },
  { value: "general", label: "General" },
];

export default function WebsiteContentEditor() {
  const { data: allContent, isLoading } = useWebsiteContent();
  const upsert = useUpsertContent();
  const deleteContent = useDeleteContent();
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState("all");

  // New item form
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newGroup, setNewGroup] = useState("general");
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState("text");
  const [showAdd, setShowAdd] = useState(false);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const filteredContent = useMemo(() => {
    if (!allContent) return [];
    return allContent.filter((c: any) => {
      const matchSearch = !search || c.section_key.toLowerCase().includes(search.toLowerCase()) || c.label?.toLowerCase().includes(search.toLowerCase()) || c.content_value?.toLowerCase().includes(search.toLowerCase());
      const matchGroup = activeGroup === "all" || c.section_group === activeGroup;
      return matchSearch && matchGroup;
    });
  }, [allContent, search, activeGroup]);

  const groups = useMemo(() => {
    if (!allContent) return [];
    const set = new Set(allContent.map((c: any) => c.section_group));
    return Array.from(set);
  }, [allContent]);

  const handleSave = (item: any) => {
    upsert.mutate({
      section_key: item.section_key,
      content_value: editValue,
      content_type: item.content_type,
      section_group: item.section_group,
      label: item.label,
    }, {
      onSuccess: () => { toast.success("Content saved"); setEditingId(null); },
      onError: (e) => toast.error("Failed: " + e.message),
    });
  };

  const handleAdd = () => {
    if (!newKey.trim()) return toast.error("Key is required");
    upsert.mutate({
      section_key: newKey.trim(),
      content_value: newValue,
      content_type: newType,
      section_group: newGroup,
      label: newLabel || newKey,
    }, {
      onSuccess: () => { toast.success("Added"); setNewKey(""); setNewValue(""); setNewLabel(""); setShowAdd(false); },
      onError: (e) => toast.error("Failed: " + e.message),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Website Content Editor" description="Edit all text, images, and content across your website" />

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search content..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={activeGroup} onValueChange={setActiveGroup}>
          <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            {SECTION_GROUPS.map((g) => (
              <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => setShowAdd(!showAdd)} variant={showAdd ? "secondary" : "default"} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Content
        </Button>
      </div>

      {/* Add New */}
      {showAdd && (
        <Card className="border-secondary/50">
          <CardHeader><CardTitle className="text-base">Add New Content Item</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Key (unique)</Label><Input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="e.g. home_hero_title" /></div>
              <div><Label>Label</Label><Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Hero Title" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Section Group</Label>
                <Select value={newGroup} onValueChange={setNewGroup}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{SECTION_GROUPS.map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Type</Label>
                <Select value={newType} onValueChange={setNewType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="image">Image URL</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Value</Label><Textarea value={newValue} onChange={(e) => setNewValue(e.target.value)} rows={3} /></div>
            <Button onClick={handleAdd} disabled={upsert.isPending}><Save className="h-4 w-4 mr-1" /> Save</Button>
          </CardContent>
        </Card>
      )}

      {/* Content List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading content...</div>
      ) : filteredContent.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Globe className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No content items found. Add some content to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredContent.map((item: any) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{item.label || item.section_key}</span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">{item.section_group}</span>
                      <span className="text-xs text-muted-foreground">{item.content_type}</span>
                    </div>
                    {editingId === item.id ? (
                      <div className="space-y-2">
                        {item.content_type === "text" || item.content_type === "html" ? (
                          <Textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} rows={4} />
                        ) : (
                          <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSave(item)} disabled={upsert.isPending}><Save className="h-3 w-3 mr-1" /> Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground line-clamp-2 cursor-pointer hover:text-foreground" onClick={() => { setEditingId(item.id); setEditValue(item.content_value); }}>
                        {item.content_type === "image" ? (
                          <span className="flex items-center gap-2">
                            <img src={item.content_value} alt="" className="h-10 w-10 object-cover rounded" />
                            {item.content_value}
                          </span>
                        ) : (
                          item.content_value || <span className="italic">Empty — click to edit</span>
                        )}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditingId(item.id); setEditValue(item.content_value); }}>
                      <Save className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => { if (confirm("Delete this content?")) deleteContent.mutate(item.id, { onSuccess: () => toast.success("Deleted") }); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
