import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useWebsitePromotions, useUpsertPromotion, useDeletePromotion } from "@/hooks/useWebsiteContent";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Gift, Calendar, Save, Megaphone, Eye } from "lucide-react";

export default function WebsitePromotionsEditor() {
  const { data: promos, isLoading } = useWebsitePromotions();
  const upsert = useUpsertPromotion();
  const deleteMut = useDeletePromotion();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("basic");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [terms, setTerms] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [badgeText, setBadgeText] = useState("");
  const [ctaText, setCtaText] = useState("Book Now");
  const [includedServices, setIncludedServices] = useState("");
  // Detail page fields
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroGradientFrom, setHeroGradientFrom] = useState("from-pink-500");
  const [heroGradientTo, setHeroGradientTo] = useState("to-rose-500");
  const [redeemStep1Title, setRedeemStep1Title] = useState("Book Online");
  const [redeemStep1Desc, setRedeemStep1Desc] = useState("Schedule your appointment through our website or call us directly.");
  const [redeemStep2Title, setRedeemStep2Title] = useState("Mention Promo");
  const [redeemStep2Desc, setRedeemStep2Desc] = useState("Let us know you're here for the promotion when you visit.");
  const [redeemStep3Title, setRedeemStep3Title] = useState("Enjoy Savings");
  const [redeemStep3Desc, setRedeemStep3Desc] = useState("Get your discount applied. It's that simple!");
  const [termsItems, setTermsItems] = useState("");
  const [ctaHeadline, setCtaHeadline] = useState("Don't Miss Out!");
  const [ctaDescription, setCtaDescription] = useState("");
  const [ctaButtonText, setCtaButtonText] = useState("Book Appointment Now");

  const resetForm = () => {
    setTitle(""); setDescription(""); setDiscountPercent(0); setStartDate(""); setEndDate(""); setTerms(""); setImageUrl(""); setIsActive(true); setBadgeText(""); setCtaText("Book Now"); setIncludedServices("");
    setHeroTitle(""); setHeroSubtitle(""); setHeroGradientFrom("from-pink-500"); setHeroGradientTo("to-rose-500");
    setRedeemStep1Title("Book Online"); setRedeemStep1Desc("Schedule your appointment through our website or call us directly.");
    setRedeemStep2Title("Mention Promo"); setRedeemStep2Desc("Let us know you're here for the promotion when you visit.");
    setRedeemStep3Title("Enjoy Savings"); setRedeemStep3Desc("Get your discount applied. It's that simple!");
    setTermsItems(""); setCtaHeadline("Don't Miss Out!"); setCtaDescription(""); setCtaButtonText("Book Appointment Now");
    setActiveTab("basic");
  };

  const openNew = () => { resetForm(); setEditItem(null); setDialogOpen(true); };

  const openEdit = (p: any) => {
    setEditItem(p);
    setTitle(p.title); setDescription(p.description); setDiscountPercent(p.discount_percent); setStartDate(p.start_date || ""); setEndDate(p.end_date || ""); setTerms(p.terms || ""); setImageUrl(p.image_url || ""); setIsActive(p.is_active); setBadgeText(p.badge_text || ""); setCtaText(p.cta_text || "Book Now"); setIncludedServices((p.included_services || []).join(", "));
    // Detail page fields from metadata
    const meta = p.detail_page_meta || {};
    setHeroTitle(meta.hero_title || p.title);
    setHeroSubtitle(meta.hero_subtitle || p.description);
    setHeroGradientFrom(meta.hero_gradient_from || "from-pink-500");
    setHeroGradientTo(meta.hero_gradient_to || "to-rose-500");
    setRedeemStep1Title(meta.redeem_step_1_title || "Book Online");
    setRedeemStep1Desc(meta.redeem_step_1_desc || "Schedule your appointment through our website or call us directly.");
    setRedeemStep2Title(meta.redeem_step_2_title || "Mention Promo");
    setRedeemStep2Desc(meta.redeem_step_2_desc || "Let us know you're here for the promotion when you visit.");
    setRedeemStep3Title(meta.redeem_step_3_title || "Enjoy Savings");
    setRedeemStep3Desc(meta.redeem_step_3_desc || "Get your discount applied. It's that simple!");
    setTermsItems(meta.terms_items || p.terms || "");
    setCtaHeadline(meta.cta_headline || "Don't Miss Out!");
    setCtaDescription(meta.cta_description || "");
    setCtaButtonText(meta.cta_button_text || "Book Appointment Now");
    setActiveTab("basic");
    setDialogOpen(true);
  };

  const handleSave = () => {
    const detail_page_meta = {
      hero_title: heroTitle, hero_subtitle: heroSubtitle,
      hero_gradient_from: heroGradientFrom, hero_gradient_to: heroGradientTo,
      redeem_step_1_title: redeemStep1Title, redeem_step_1_desc: redeemStep1Desc,
      redeem_step_2_title: redeemStep2Title, redeem_step_2_desc: redeemStep2Desc,
      redeem_step_3_title: redeemStep3Title, redeem_step_3_desc: redeemStep3Desc,
      terms_items: termsItems, cta_headline: ctaHeadline, cta_description: ctaDescription, cta_button_text: ctaButtonText,
    };
    const payload: any = {
      title, description, discount_percent: discountPercent, start_date: startDate || null, end_date: endDate || null,
      terms: terms || null, image_url: imageUrl || null, is_active: isActive, badge_text: badgeText, cta_text: ctaText,
      included_services: includedServices.split(",").map(s => s.trim()).filter(Boolean),
      detail_page_meta,
    };
    if (editItem) payload.id = editItem.id;
    upsert.mutate(payload, { onSuccess: () => { toast.success("Saved"); setDialogOpen(false); }, onError: (e) => toast.error(e.message) });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Promotions Editor" description="Manage promotional offers, banners, and their detail pages" />
      <div className="flex justify-end"><Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Add Promotion</Button></div>

      {isLoading ? <p className="text-center text-muted-foreground py-8">Loading...</p> : (
        <div className="space-y-3">
          {promos?.map((p: any) => (
            <Card key={p.id} className={`group ${!p.is_active ? 'opacity-50' : ''}`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0">
                  <Gift className="h-7 w-7 text-rose-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium">{p.title}</p>
                    {p.discount_percent > 0 && <Badge variant="secondary">{p.discount_percent}% OFF</Badge>}
                    {!p.is_active && <Badge variant="outline">Inactive</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
                  {p.start_date && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Calendar className="h-3 w-3" />{p.start_date} — {p.end_date}</p>}
                </div>
                <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(p)} title="Edit"><Edit className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("Delete?")) deleteMut.mutate(p.id, { onSuccess: () => toast.success("Deleted") }); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!promos || promos.length === 0) && <p className="text-center text-muted-foreground py-8">No promotions yet</p>}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editItem ? "Edit" : "Add"} Promotion</DialogTitle></DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="basic"><Megaphone className="h-3.5 w-3.5 mr-1" />Basic</TabsTrigger>
              <TabsTrigger value="services"><Gift className="h-3.5 w-3.5 mr-1" />Services</TabsTrigger>
              <TabsTrigger value="detail"><Eye className="h-3.5 w-3.5 mr-1" />Detail Page</TabsTrigger>
              <TabsTrigger value="cta"><Save className="h-3.5 w-3.5 mr-1" />CTA & Terms</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-3 mt-4">
              <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
              <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Discount %</Label><Input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} /></div>
                <div><Label>Badge Text</Label><Input value={badgeText} onChange={(e) => setBadgeText(e.target.value)} placeholder="Limited Time" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Start Date</Label><Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
                <div><Label>End Date</Label><Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
              </div>
              <div><Label>CTA Button Text (Card)</Label><Input value={ctaText} onChange={(e) => setCtaText(e.target.value)} /></div>
              <div><Label>Image URL</Label><Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} /></div>
              {imageUrl && <img src={imageUrl} alt="" className="h-20 w-32 object-cover rounded" />}
              <div className="flex items-center gap-2"><Switch checked={isActive} onCheckedChange={setIsActive} /><Label>Active</Label></div>
            </TabsContent>

            <TabsContent value="services" className="space-y-3 mt-4">
              <div>
                <Label>Included Services (comma-separated)</Label>
                <Textarea value={includedServices} onChange={(e) => setIncludedServices(e.target.value)} rows={4} placeholder="General & Preventive Dentistry, Cosmetic Dentistry, Orthodontics..." />
                <p className="text-xs text-muted-foreground mt-1">These appear as checkmarked items on the promotion detail page</p>
              </div>
              {includedServices && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Preview:</p>
                  {includedServices.split(",").map(s => s.trim()).filter(Boolean).map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm"><span className="text-green-500">✓</span>{s}</div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="detail" className="space-y-3 mt-4">
              <p className="text-sm text-muted-foreground">Configure how the promotion "Learn More" detail page looks.</p>
              <Card className="border-dashed">
                <CardHeader className="pb-2"><CardTitle className="text-sm">Hero Section</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div><Label>Hero Title</Label><Input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder={title} /></div>
                  <div><Label>Hero Subtitle</Label><Textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} rows={2} placeholder={description} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Gradient From</Label><Input value={heroGradientFrom} onChange={(e) => setHeroGradientFrom(e.target.value)} placeholder="from-pink-500" /></div>
                    <div><Label>Gradient To</Label><Input value={heroGradientTo} onChange={(e) => setHeroGradientTo(e.target.value)} placeholder="to-rose-500" /></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardHeader className="pb-2"><CardTitle className="text-sm">How to Redeem Steps</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { t: redeemStep1Title, setT: setRedeemStep1Title, d: redeemStep1Desc, setD: setRedeemStep1Desc, n: 1 },
                    { t: redeemStep2Title, setT: setRedeemStep2Title, d: redeemStep2Desc, setD: setRedeemStep2Desc, n: 2 },
                    { t: redeemStep3Title, setT: setRedeemStep3Title, d: redeemStep3Desc, setD: setRedeemStep3Desc, n: 3 },
                  ].map(step => (
                    <div key={step.n} className="grid grid-cols-2 gap-3 p-3 rounded-lg border">
                      <div><Label>Step {step.n} Title</Label><Input value={step.t} onChange={(e) => step.setT(e.target.value)} /></div>
                      <div><Label>Step {step.n} Description</Label><Input value={step.d} onChange={(e) => step.setD(e.target.value)} /></div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cta" className="space-y-3 mt-4">
              <div><Label>Terms & Conditions (one per line)</Label>
                <Textarea value={termsItems} onChange={(e) => setTermsItems(e.target.value)} rows={5} placeholder={"Valid from Feb 1 - 21, 2026\nApplies to all dental services\nCannot be combined with other offers"} />
                <p className="text-xs text-muted-foreground mt-1">Each line becomes a bullet point on the detail page</p>
              </div>
              <div><Label>Short Terms Summary</Label><Textarea value={terms} onChange={(e) => setTerms(e.target.value)} rows={2} /></div>
              <Card className="border-dashed">
                <CardHeader className="pb-2"><CardTitle className="text-sm">Bottom CTA Section</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div><Label>CTA Headline</Label><Input value={ctaHeadline} onChange={(e) => setCtaHeadline(e.target.value)} /></div>
                  <div><Label>CTA Description</Label><Textarea value={ctaDescription} onChange={(e) => setCtaDescription(e.target.value)} rows={2} /></div>
                  <div><Label>CTA Button Text</Label><Input value={ctaButtonText} onChange={(e) => setCtaButtonText(e.target.value)} /></div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Button onClick={handleSave} disabled={upsert.isPending} className="w-full mt-4"><Save className="h-4 w-4 mr-1" />Save Promotion</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
