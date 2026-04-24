import { Layout } from "@/components/layout";

const Terms = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-dental-teal-pale via-background to-dental-mint">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold text-primary sm:text-5xl">
              Terms & <span className="text-secondary">Conditions</span>
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
                <h2 className="text-2xl font-bold text-primary mb-4">Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing our website or using our services, you agree to be bound by these 
                  Terms and Conditions. If you do not agree to these terms, please do not use our 
                  services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Services</h2>
                <p className="text-muted-foreground">
                  Vista Dental Care provides dental services including but not limited to general 
                  dentistry, cosmetic dentistry, orthodontics, and oral surgery. All services are 
                  provided by qualified dental professionals.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Appointments</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Appointments can be made via phone, email, or our online booking form.</li>
                  <li>Please arrive 10-15 minutes before your scheduled appointment time.</li>
                  <li>If you need to cancel or reschedule, please provide at least 24 hours notice.</li>
                  <li>Repeated no-shows may result in a cancellation fee or termination of services.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Payment Terms</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Payment is due at the time of service unless other arrangements have been made.</li>
                  <li>We accept cash, bank transfers, and major debit cards.</li>
                  <li>For insurance patients, you are responsible for any amounts not covered by insurance.</li>
                  <li>Payment plans may be available for certain procedures.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Patient Responsibilities</h2>
                <p className="text-muted-foreground mb-4">As a patient, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide accurate and complete medical and dental history</li>
                  <li>Inform us of any changes to your health condition</li>
                  <li>Follow post-treatment instructions provided by our dental team</li>
                  <li>Attend scheduled follow-up appointments</li>
                  <li>Maintain good oral hygiene between visits</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  While we strive to provide the highest quality dental care, we cannot guarantee 
                  specific outcomes. Dental treatment results may vary based on individual factors. 
                  We are not liable for any complications arising from failure to follow post-treatment 
                  instructions.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Website Use</h2>
                <p className="text-muted-foreground">
                  The content on our website is for informational purposes only and does not 
                  constitute medical advice. Always consult with a dental professional for 
                  specific dental concerns.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify these Terms and Conditions at any time. Changes 
                  will be effective immediately upon posting on our website. Your continued use 
                  of our services constitutes acceptance of any modifications.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have questions about these Terms and Conditions, please contact us at:
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

export default Terms;
