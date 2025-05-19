import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { ShipWheel, Anchor, Waves, Compass, Globe, BarChart2, Cloud, ShieldCheck } from 'lucide-react';

const AboutFront = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const stats = [
    { value: "100+", label: "Vessels Managed", icon: <ShipWheel className="h-5 w-5" /> },
    { value: "24/7", label: "Global Support", icon: <Globe className="h-5 w-5" /> },
    { value: "99.9%", label: "Uptime", icon: <Cloud className="h-5 w-5" /> },
    { value: "ISO Certified", label: "Security", icon: <ShieldCheck className="h-5 w-5" /> },
  ];

  return (
    <section id="about" className="relative py-24 overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-accent/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Anchor className="h-5 w-5 mr-2 text-primary" />
            <span className="text-sm font-medium text-primary">About Euroasiann</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Revolutionizing Maritime Management
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-xl text-muted-foreground mb-6">
              Euroasiann is an innovative <span className="font-semibold text-primary">cloud-based</span> ship management and maritime ERP solution designed to streamline operations, reduce costs, and improve efficiency across your entire fleet.
            </p>
            
            <p className="text-xl text-muted-foreground mb-8">
              Founded by a team of <span className="font-semibold text-primary">maritime experts</span> and technology innovators, we're on a mission to transform how the maritime industry operates through intelligent software solutions.
            </p>

            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              {stats.map((stat, index) => (
                <motion.div key={index} variants={item} className="bg-background/50 border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {stat.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="flex flex-wrap gap-4">
              <Button className="gap-2">
                <Compass className="h-4 w-4" />
                Learn More
              </Button>
              <Button variant="outline" className="gap-2">
                <Waves className="h-4 w-4" />
                Contact Us
              </Button>
            </div>
          </motion.div>

          <motion.div 
            className="lg:w-1/2 relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="absolute -z-10 -top-20 -right-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse"></div>
            
            <div className="relative bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/10 backdrop-blur-sm overflow-hidden">
              {/* Decorative compass */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 text-primary/10">
                <Compass className="w-full h-full" />
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <BarChart2 className="h-6 w-6 text-primary" />
                  <span>Our Vision & Mission</span>
                </h3>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-primary">Our Vision</h4>
                    <p className="text-muted-foreground">
                      To create a <span className="font-medium">connected maritime ecosystem</span> where all stakeholders collaborate seamlessly, driving efficiency and sustainability in global shipping operations.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-primary">Our Mission</h4>
                    <p className="text-muted-foreground">
                      To provide <span className="font-medium">innovative technology solutions</span> that simplify complex maritime operations, enabling shipping companies to focus on growth and excellence in service delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutFront;