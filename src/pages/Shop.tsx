import { useState, useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, Search, ShoppingBag, ShoppingCart, X, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout";
import { useClinicSettings } from "@/hooks/useClinicSettings";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import shopHero from "@/assets/shop-hero.jpg";

const formatWhatsAppNumber = (phone: string | null | undefined): string => {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return "234" + digits.slice(1);
  return digits;
};

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

const Shop = () => {
  const { products, isLoading } = useProducts();
  const { data: clinicSettings } = useClinicSettings();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const inStockProducts = useMemo(() => {
    return products
      .filter((p) => p.in_stock)
      .filter((p) => {
        const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === "All" || p.category === activeCategory;
        return matchesSearch && matchesCategory;
      });
  }, [products, search, activeCategory]);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [products]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1, image_url: product.image_url }];
    });
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const whatsappNumber = formatWhatsAppNumber(clinicSettings?.phone);
    if (!whatsappNumber) return;
    const itemsList = cart.map(item => `• ${item.name} × ${item.quantity} — ₦${(item.price * item.quantity).toLocaleString()}`).join("\n");
    const message = encodeURIComponent(
      `Hi! I'd like to order:\n\n${itemsList}\n\n*Total: ₦${cartTotal.toLocaleString()}*\n\nPlease confirm availability. Thank you!`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  const shareLink = `${window.location.origin}/shop`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success("Shop link copied to clipboard!");
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[400px] overflow-hidden wave-divider">
        <motion.img src={shopHero} alt="Dental products" className="absolute inset-0 h-full w-full object-cover" initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: "easeOut" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/40 to-background/80" />
        <div className="absolute top-8 right-12 w-40 h-40 blob bg-secondary/20 blur-2xl" />
        <div className="absolute bottom-16 left-8 w-28 h-28 blob-2 bg-primary/30 blur-2xl" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center pb-8 px-4 text-center">
          <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 backdrop-blur-sm mb-5" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <ShoppingBag className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium text-white">Dental Care Shop</span>
          </motion.div>
          <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-md" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }}>
            Dental Care Products
          </motion.h1>
          <motion.p className="mt-4 max-w-xl text-white/80 text-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
            Quality oral care essentials — add to cart & order via WhatsApp
          </motion.p>
        </div>
      </section>

      {/* Search, Filters & Share */}
      <section className="bg-background">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat ? "bg-secondary text-secondary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}>
                  {cat === "All" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-1.5">
              📎 Share Shop Link
            </Button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="bg-background">
        <div className="container mx-auto px-4 pb-20">
          {isLoading ? (
            <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />)}
            </div>
          ) : inStockProducts.length === 0 ? (
            <motion.div className="flex flex-col items-center justify-center py-24 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-4"><Package className="h-10 w-10 text-secondary" /></div>
              <h2 className="text-xl font-semibold text-foreground">No Products Found</h2>
              <p className="text-muted-foreground mt-1">{search || activeCategory !== "All" ? "Try a different search or category." : "Check back soon for new products."}</p>
            </motion.div>
          ) : (
            <motion.div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4" layout>
              <AnimatePresence mode="popLayout">
                {inStockProducts.map((product, i) => (
                  <motion.div key={product.id} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05, duration: 0.4 }}>
                    <div className="relative overflow-hidden rounded-2xl bg-card border border-border transition-all duration-500 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
                      <Link to={`/shop/${product.id}`} className="block">
                        <div className="aspect-square overflow-hidden bg-muted relative">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-accent/30"><Package className="h-12 w-12 text-secondary/40" /></div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        {product.category && <Badge variant="secondary" className="absolute top-3 left-3 text-xs backdrop-blur-sm bg-primary/80 text-primary-foreground border-0">{product.category}</Badge>}
                        {product.stock_quantity > 0 && product.stock_quantity <= 5 && <Badge variant="destructive" className="absolute top-3 right-3 text-xs">Only {product.stock_quantity} left</Badge>}
                      </Link>
                      <div className="p-4 flex flex-col flex-1">
                        <Link to={`/shop/${product.id}`}>
                          <h3 className="font-semibold text-foreground line-clamp-1 text-sm md:text-base hover:text-secondary transition-colors">{product.name}</h3>
                        </Link>
                        {product.description && <p className="text-xs text-muted-foreground line-clamp-2 mt-1 flex-1">{product.description}</p>}
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-lg font-bold text-secondary">₦{product.price.toLocaleString()}</p>
                          <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={(e) => { e.preventDefault(); addToCart(product); }}>
                            <ShoppingCart className="h-3.5 w-3.5" /> Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="fixed bottom-6 right-6 z-50">
          <Button size="lg" className="rounded-full shadow-2xl gap-2 h-14 px-6" onClick={() => setCartOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
            Cart ({cartCount}) — ₦{cartTotal.toLocaleString()}
          </Button>
        </motion.div>
      )}

      {/* Cart Dialog */}
      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Your Cart ({cartCount} items)</DialogTitle></DialogHeader>
          {cart.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">Your cart is empty</p>
          ) : (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded bg-muted flex items-center justify-center"><Package className="h-6 w-6 text-muted-foreground" /></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">₦{item.price.toLocaleString()} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>-</Button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>+</Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeFromCart(item.id)}>
                      <X className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {cart.length > 0 && (
            <div className="space-y-3 pt-3 border-t">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>₦{cartTotal.toLocaleString()}</span>
              </div>
              <Button className="w-full gap-2" size="lg" onClick={handleWhatsAppOrder}>
                <MessageCircle className="h-5 w-5" />
                Order via WhatsApp
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bottom CTA */}
      <section className="bg-primary text-primary-foreground py-14">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Need Personalised Advice?</h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">Our dental team is happy to recommend the right oral care products for you.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90 transition-colors shadow-lg">Contact Us</Link>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
