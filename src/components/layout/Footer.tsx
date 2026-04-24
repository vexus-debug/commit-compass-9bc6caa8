import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin, Clock } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { useWebsiteContent, getContent } from "@/hooks/useWebsiteContent";

const Footer = () => {
  const { data: contactContent } = useWebsiteContent("contact");
  const { data: footerContent } = useWebsiteContent("footer");
  const { data: generalContent } = useWebsiteContent("general");
  const { data: socialContent } = useWebsiteContent("social");

  const clinicName = getContent(generalContent, "clinic_name", "Vista Dental Care");
  const tagline = getContent(footerContent, "footer_tagline", "Your trusted partner for comprehensive dental care in Abuja. We're committed to giving you a healthy, beautiful smile.");
  const address = getContent(contactContent, "clinic_address", "Shop 221, Axis Plaza, Plot 678, Rachel T. Owolabi Close, Gaduwa, Abuja.");
  const phone1 = getContent(contactContent, "clinic_phone_1", "070 8878 8880");
  const phone2 = getContent(contactContent, "clinic_phone_2", "090 7776 6681");
  const email = getContent(contactContent, "clinic_email", "Vista.dcs@gmail.com");
  const hoursWeekday = getContent(contactContent, "clinic_hours_weekday", "Mon – Fri: 9:00 AM – 6:00 PM");
  const hoursSaturday = getContent(contactContent, "clinic_hours_saturday", "Saturday: 9:00 AM – 6:00 PM");
  const hoursSunday = getContent(contactContent, "clinic_hours_sunday", "Sunday: Closed");
  const igUrl = getContent(socialContent, "instagram_url", "https://instagram.com/vista.dcs");

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt={clinicName} className="h-12 w-12 rounded-full object-cover" />
              <div className="flex flex-col">
                <span className="text-lg font-bold">{clinicName}</span>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80">{tagline}</p>
            <div className="flex gap-4">
              <a href={igUrl} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/about", label: "About Us" },
                { to: "/services", label: "Our Services" },
                { to: "/testimonials", label: "Testimonials" },
                { to: "/gallery", label: "Gallery" },
                { to: "/shop", label: "Shop" },
                { to: "/promotions", label: "Promotions" },
                { to: "/faq", label: "FAQ" },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-primary-foreground/80 hover:text-secondary transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Our Services</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/services/general-preventive", label: "General & Preventive" },
                { to: "/services/cosmetic", label: "Cosmetic Dentistry" },
                { to: "/services/orthodontics", label: "Orthodontics" },
                { to: "/services/implants", label: "Dental Implants" },
                { to: "/services/oral-surgery", label: "Oral Surgery" },
                { to: "/services/periodontics", label: "Gum Treatment" },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-primary-foreground/80 hover:text-secondary transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80">{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <div className="text-primary-foreground/80">
                  <a href={`tel:${phone1.replace(/\s/g, "")}`} className="hover:text-secondary transition-colors block">{phone1}</a>
                  <a href={`tel:${phone2.replace(/\s/g, "")}`} className="hover:text-secondary transition-colors block">{phone2}</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <a href={`mailto:${email}`} className="text-primary-foreground/80 hover:text-secondary transition-colors">{email}</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-secondary shrink-0" />
                <div className="text-primary-foreground/80 space-y-0.5">
                  <div>{hoursWeekday}</div>
                  <div>{hoursSaturday}</div>
                  <div>{hoursSunday}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/70">
            <p>© 2026 {clinicName}. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className="hover:text-secondary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-secondary transition-colors">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;