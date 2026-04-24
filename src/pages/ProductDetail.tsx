import { useParams, Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useClinicSettings } from "@/hooks/useClinicSettings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Package, ShieldCheck, Truck, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";

const formatWhatsAppNumber = (phone: string | null | undefined): string => {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return "234" + digits.slice(1);
  return digits;
};

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { products, isLoading } = useProducts();
  const { data: clinicSettings } = useClinicSettings();

  const product = products.find((p) => p.id === productId);

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const whatsappNumber = formatWhatsAppNumber(clinicSettings?.phone);
    if (!whatsappNumber) return;
    const message = encodeURIComponent(
      `Hi! I'd like to order:\n\n` +
      `*${product.name}*\n` +
      `Price: ₦${product.price.toLocaleString()}\n\n` +
      `Please confirm availability. Thank you!`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="h-10 w-10 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
            <Package className="h-10 w-10 text-secondary/50" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Product not found</h1>
          <Button asChild variant="outline">
            <Link to="/shop">← Back to Shop</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category && p.in_stock)
    .slice(0, 4);

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-secondary transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="bg-background">
        <div className="container mx-auto px-4 py-10 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Image */}
            <motion.div
              className="relative overflow-hidden rounded-3xl bg-muted aspect-square shadow-xl"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-accent/30">
                  <Package className="h-24 w-24 text-secondary/20" />
                </div>
              )}
              {/* decorative corner accent */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-secondary/20 to-transparent rounded-br-3xl" />

              {product.category && (
                <Badge className="absolute top-4 left-4 bg-primary/80 text-primary-foreground backdrop-blur-sm border-0">
                  {product.category}
                </Badge>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              className="flex flex-col justify-center"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              {/* Category label */}
              {product.category && (
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-secondary mb-3">
                  {product.category}
                </span>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-3">
                <p className="text-4xl font-bold text-secondary">
                  ₦{product.price.toLocaleString()}
                </p>
              </div>

              {/* Stock info */}
              <div className="mt-4">
                {product.in_stock ? (
                  <Badge className="bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20">
                    {product.stock_quantity > 0
                      ? `${product.stock_quantity} in stock`
                      : "In Stock"}
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>

              {/* Divider */}
              <div className="my-6 h-px bg-border" />

              {product.description && (
                <p className="text-muted-foreground leading-relaxed text-base">
                  {product.description}
                </p>
              )}

              {/* CTA */}
              <Button
                size="lg"
                className="mt-8 gap-3 h-14 text-base rounded-2xl bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg"
                onClick={handleWhatsAppOrder}
                disabled={!product.in_stock}
              >
                <MessageCircle className="h-5 w-5" />
                Order via WhatsApp
              </Button>

              {/* Trust signals */}
              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  { icon: ShieldCheck, label: "Quality Guaranteed" },
                  { icon: Truck, label: "Fast Delivery" },
                  { icon: Clock, label: "Quick Response" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-accent text-center"
                  >
                    <Icon className="h-5 w-5 text-secondary" />
                    <span className="text-xs text-muted-foreground font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-muted/30 border-t border-border">
          <div className="container mx-auto px-4 py-14">
            <div className="flex items-center gap-3 mb-8">
              <Star className="h-5 w-5 text-secondary fill-secondary" />
              <h2 className="text-2xl font-bold text-foreground">You may also like</h2>
            </div>
            <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
              {relatedProducts.map((rp, i) => (
                <motion.div
                  key={rp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/shop/${rp.id}`} className="group block">
                    <div className="overflow-hidden rounded-2xl bg-card border border-border transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
                      <div className="aspect-square overflow-hidden bg-muted relative">
                        {rp.image_url ? (
                          <img
                            src={rp.image_url}
                            alt={rp.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-accent/30">
                            <Package className="h-10 w-10 text-secondary/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-foreground text-sm line-clamp-1 group-hover:text-secondary transition-colors">
                          {rp.name}
                        </h3>
                        <p className="mt-1 text-secondary font-bold">
                          ₦{rp.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Not sure what you need?</h2>
          <p className="text-primary-foreground/80 mb-6">Our team is ready to guide you to the right products.</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90 transition-colors shadow-lg"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
