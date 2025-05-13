"use client"
import { MapPin, Package, Ship, Users, Anchor, Briefcase } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

const StakeHolder = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const stakeholders = [
    {
      icon: <Ship className="h-6 w-6" />,
      title: "Ship Managers",
      description: "Gain complete visibility of your fleet operations, maintenance schedules, and crew management in one unified platform.",
      features: ["Centralized fleet management", "Cost optimization tools", "Compliance monitoring"],
      color: "bg-gradient-to-br from-blue-500/10 to-blue-600/5"
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Vendors",
      description: "Streamline your sales process with direct access to RFQs, simplified communication, and automated order processing.",
      features: ["Direct RFQ notifications", "Simplified quote submission", "Order tracking dashboard"],
      color: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/5"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Port Agents",
      description: "Coordinate vessel arrivals, departures, and port services with real-time communication and documentation.",
      features: ["Vessel schedule visibility", "Document exchange portal", "Service coordination tools"],
      color: "bg-gradient-to-br from-amber-500/10 to-amber-600/5"
    },
    
  ]

  return (
    <section id="stakeholders" className="relative py-24 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
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
            <span className="text-sm font-medium text-primary">Maritime Ecosystem</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            For Every Maritime Stakeholder
          </h2>
          <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
            Euroasiann connects all stakeholders in the maritime ecosystem, providing <span className="font-semibold text-primary">tailored solutions</span> for each role.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {stakeholders.map((stakeholder, index) => (
            <motion.div key={index} variants={item}>
              <Card className={cn(
                "group border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full",
                "hover:-translate-y-2 relative overflow-hidden",
                stakeholder.color
              )}>
                <CardHeader>
                  <div className={cn(
                    "rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 transition-all duration-300",
                    "group-hover:bg-primary/10 group-hover:scale-110",
                    stakeholder.color.includes('blue') ? 'bg-blue-500/5' :
                    stakeholder.color.includes('emerald') ? 'bg-emerald-500/5' :
                    stakeholder.color.includes('amber') ? 'bg-amber-500/5' :
                    stakeholder.color.includes('violet') ? 'bg-violet-500/5' :
                    stakeholder.color.includes('rose') ? 'bg-rose-500/5' : 'bg-indigo-500/5'
                  )}>
                    {React.cloneElement(stakeholder.icon, { 
                      className: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" 
                    })}
                  </div>
                  <CardTitle className="text-2xl font-bold tracking-tight">{stakeholder.title}</CardTitle>
                  <CardDescription className="text-lg mt-2">{stakeholder.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {stakeholder.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <div className="flex-shrink-0 mt-1 mr-3">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-muted-foreground mb-6">
            Ready to join our maritime network?
          </p>
          <Button className="relative overflow-hidden group">
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 transition-all duration-300 group-hover:opacity-90"></span>
            <span className="relative flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Contact Our Team
            </span>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default StakeHolder