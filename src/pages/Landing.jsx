import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, LayoutGrid, Map, PieChart, FileDown, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

function ValueCard({ icon: Icon, title, desc, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function PricingFeature({ text }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
      <span className="text-sm">{text}</span>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-lg">Blueprint Builder</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link to="/builder">
              <Button size="sm" className="gap-2">
                Start Building <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Marketing Strategy Made Visual
            </div>
          </motion.div>
          <motion.h1
            {...fadeUp}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6"
          >
            Create Your Business<br />
            <span className="text-primary">Marketing Blueprint</span>
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Map your customer journey, marketing channels, time, cost, and weekly actions into one clear visual system.
            Turn random marketing ideas into a structured plan.
          </motion.p>
          <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/builder">
              <Button size="lg" className="gap-2 px-8 text-base">
                Start Your Blueprint <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/results">
              <Button size="lg" variant="outline" className="px-8 text-base">
                See Example
              </Button>
            </Link>
          </motion.div>

          <motion.p
            {...fadeUp}
            transition={{ delay: 0.4 }}
            className="mt-8 text-sm text-muted-foreground italic"
          >
            "Traffic → Conversion → Follow-Up → Sales"
          </motion.p>
        </div>
      </section>

      {/* Value Cards */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-3">What You Get</h2>
            <p className="text-muted-foreground">Everything you need to plan, visualize, and execute your marketing strategy</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard icon={LayoutGrid} title="Visual Business Map" desc="See your marketing home base with all channels connected around your business center hub." delay={0} />
            <ValueCard icon={Map} title="Customer Journey Printout" desc="Map every stage from awareness to referral with actions, owners, and drop-off risks." delay={0.1} />
            <ValueCard icon={PieChart} title="Time + Cost Allocation" desc="Understand where your marketing time and money go with clear percentage breakdowns." delay={0.2} />
            <ValueCard icon={FileDown} title="PDF Export for Planning" desc="Download a polished, print-ready document you can share with your team or consultant." delay={0.3} />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl font-bold mb-3">How It Works</h2>
          <p className="text-muted-foreground">Three simple steps to your marketing blueprint</p>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Set Up Your Business", desc: "Enter your business basics, choose your storefront type, and select your marketing channels." },
            { step: "02", title: "Build Your Blueprint", desc: "Fill in channel details, map your customer journey, and define your business objectives." },
            { step: "03", title: "Generate & Export", desc: "View your complete visual blueprint, download the PDF, and start executing your plan." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="text-5xl font-display font-bold text-primary/15 mb-3">{item.step}</div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-muted/30" id="pricing">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold mb-3">Simple Pricing</h2>
            <p className="text-muted-foreground">One price, everything included</p>
          </div>
          <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold font-display mb-1">$19.99</div>
              <p className="text-muted-foreground">per business</p>
            </div>
            <div className="space-y-3 mb-8">
              <PricingFeature text="1 complete business draft" />
              <PricingFeature text="Full visual marketing blueprint" />
              <PricingFeature text="Customer journey map" />
              <PricingFeature text="Time & cost allocation summary" />
              <PricingFeature text="Downloadable PDF export" />
              <PricingFeature text="Weekly action plan" />
              <PricingFeature text="Print-friendly home base summary" />
            </div>
            <Link to="/builder" className="block">
              <Button className="w-full gap-2" size="lg">
                Start Your Blueprint <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <p className="text-xs text-center text-muted-foreground mt-4">
              Works whether you do marketing yourself or hire someone
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <LayoutGrid className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold">Marketing Blueprint Builder</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Build a simple marketing home base for your business.
          </p>
        </div>
      </footer>
    </div>
  );
}