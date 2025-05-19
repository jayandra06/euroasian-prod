import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import { Calendar, Compass, MapPin, Package, Ship, Users, Anchor, Waves, Navigation, ClipboardList, BarChart2, MessageSquare } from 'lucide-react';

const Modules = () => {
  const modules = [
    {
      icon: <Ship className="h-6 w-6" />,
      title: "Ship & Crew Management",
      description: "Efficiently manage vessel operations and crew scheduling in one place.",
      features: ["Crew certification tracking", "Vessel documentation", "Performance monitoring"],
      bgGradient: "from-blue-500/10 to-blue-600/5",
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Spare Parts & Procurement",
      description: "Streamline your procurement process with automated RFQ handling.",
      features: ["Inventory management", "Automated RFQ generation", "Vendor comparison tools"],
      bgGradient: "from-emerald-500/10 to-emerald-600/5",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Vendor & Agent Communication",
      description: "Centralized communication with vendors and port agents.",
      features: ["Integrated messaging system", "Document sharing", "Performance tracking"],
      bgGradient: "from-violet-500/10 to-violet-600/5",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Route Planning & Tracking",
      description: "Optimize voyage planning and real-time vessel tracking.",
      features: ["Route optimization", "Real-time vessel tracking", "Weather integration"],
      bgGradient: "from-amber-500/10 to-amber-600/5",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Dry Dock & Maintenance",
      description: "Schedule and manage maintenance activities and dry docking.",
      features: ["Maintenance scheduling", "Dry dock planning", "Compliance tracking"],
      bgGradient: "from-rose-500/10 to-rose-600/5",
    },
    {
      icon: <Compass className="h-6 w-6" />,
      title: "Analytics & Reporting",
      description: "Gain insights with comprehensive analytics and reporting tools.",
      features: ["Custom dashboards", "Performance metrics", "Exportable reports"],
      bgGradient: "from-indigo-500/10 to-indigo-600/5",
    },
  ];

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

  return (
    <section id="modules" className="relative py-24 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-accent/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Water wave divider at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDEyMCI+PHBhdGggZmlsbD0iIzAwODBmZiIgZmlsbC1vcGFjaXR5PSIwLjEiIGQ9Ik0wIDYzLjc1QzAgNjMuNzUgMTgwIDAgMzYwIDBjMTgwIDAgMzYwIDYzLjc1IDM2MCA2My43NVM3MjAgMCA5MDAgMGMxODAgMCAzMDAgNjMuNzUgMzAwIDYzLjc1VjEyMEgwVjYzLjc1eiIvPjwvc3ZnPg==')] bg-repeat-x bg-[length:1200px_120px]"></div>

      <div className="container relative z-10">
        {/* Section header with animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Anchor className="h-5 w-5 mr-2 text-primary" />
            <span className="text-sm font-medium text-primary">Integrated Solutions</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Comprehensive Maritime Modules
          </h2>
          <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform offers <span className="font-semibold text-primary">seamlessly integrated</span> modules to optimize every aspect of your maritime operations.
          </p>
        </motion.div>

        {/* Modules grid with staggered animation */}
        <motion.div
  variants={container}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, margin: "-100px" }}
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4" // Added padding here
>
  {modules.map((module, index) => (
    <motion.div key={index} variants={item} className="mb-8"> {/* Added margin-bottom to give space between cards */}
      <Card
        className={cn(
          "border-none shadow-lg hover:shadow-xl transition-all duration-300 group",
          "hover:-translate-y-2 relative overflow-hidden h-full",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-0 before:transition-opacity before:duration-300",
          "group-hover:before:opacity-100",
          `before:${module.bgGradient}`,
          "px-6 py-4" // Add padding to the card for more space inside
        )}
      >
        <div className="relative z-10 h-full flex flex-col">
          <CardHeader>
            <div
              className={cn(
                "rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 transition-all duration-300",
                "group-hover:bg-primary/10 group-hover:scale-110",
                `bg-${module.bgGradient.split(' ')[0].replace('/10', '/5')}`
              )}
            >
              {React.cloneElement(module.icon, {
                className: "h-6 w-6 text-primary group-hover:scale-110 transition-transform",
              })}
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">{module.title}</CardTitle>
            <CardDescription className="text-lg mt-2">{module.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              {module.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  ))}
</motion.div>


        {/* CTA at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-lg text-muted-foreground mb-6">
            Ready to transform your maritime operations?
          </p>
          <button className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white transition-all duration-300 rounded-xl bg-primary group hover:bg-primary/90">
            <span className="absolute top-0 left-0 w-full h-full -mt-1 -ml-1 transition-all duration-300 ease-in-out bg-primary/80 rounded-xl blur-md group-hover:-mt-1 group-hover:-ml-1 group-hover:bg-primary/90"></span>
            <span className="absolute inset-0 w-full h-full transition duration-300 ease-in-out rounded-xl bg-gradient-to-br from-primary to-primary/70 group-hover:from-primary/90 group-hover:to-primary/80"></span>
            <span className="relative flex items-center">
              <Navigation className="w-5 h-5 mr-2" />
              Request Demo
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Modules;