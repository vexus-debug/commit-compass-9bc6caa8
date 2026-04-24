import { Layout } from "@/components/layout";

const PrivacyPolicy = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-dental-teal-pale via-background to-dental-mint">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold text-primary sm:text-5xl">
              Privacy <span className="text-secondary">Policy</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Last updated: February 1, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <div className="max-w-3xl mx-auto prose prose-slate">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Introduction</h2>
                <p className="text-muted-foreground">
                  Vista Dental Care ("we," "our," or "us") is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                  information when you visit our clinic or use our website.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Information We Collect</h2>
                <p className="text-muted-foreground mb-4">We may collect the following types of information:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Personal identification information (name, email address, phone number, address)</li>
                  <li>Medical and dental history</li>
                  <li>Insurance information</li>
                  <li>Payment information</li>
                  <li>Appointment details</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide and manage your dental care</li>
                  <li>Process appointments and payments</li>
                  <li>Communicate with you about your treatment</li>
                  <li>Send appointment reminders</li>
                  <li>Improve our services</li>
                  <li>Comply with legal requirements</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Information Sharing</h2>
                <p className="text-muted-foreground">
                  We do not sell, trade, or rent your personal information to third parties. 
                  We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li>With your consent</li>
                  <li>With healthcare providers involved in your care</li>
                  <li>With insurance companies for claims processing</li>
                  <li>When required by law</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate security measures to protect your personal information. 
                  However, no method of transmission over the internet or electronic storage is 
                  100% secure, and we cannot guarantee absolute security.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Your Rights</h2>
                <p className="text-muted-foreground mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have questions about this Privacy Policy or our practices, please contact us at:
                </p>
                <div className="mt-4 text-muted-foreground">
                  <p>Vista Dental Care</p>
                  <p>Shop 221, Axis Plaza, Plot 678</p>
                  <p>Rachel T. Owolabi Close, Gaduwa, Abuja</p>
                  <p>Email: Vista.dcs@gmail.com</p>
                  <p>Phone: 070 8878 8880</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
