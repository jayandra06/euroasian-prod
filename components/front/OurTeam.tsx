import React from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Skeleton } from '../ui/skeleton'
import { Card } from '../ui/card'
import { Linkedin, Globe } from 'lucide-react'
import { Button } from '../ui/button'

const OurTeam = () => {
  const [imagesLoaded, setImagesLoaded] = React.useState(false)

  // Simulate image loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setImagesLoaded(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const teamMembers = [
    {
      name: "Alex Morgan",
      role: "Founder & CEO",
      bio: "Former maritime operations director with 10+ years in the shipping industry.",
      initials: "AM",
      social: {
        linkedin: "#",
        website: "#"
      }
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      bio: "Software architect specializing in enterprise solutions for logistics and transportation.",
      initials: "SC",
      social: {
        linkedin: "#",
        website: "#"
      }
    },
    {
      name: "James Wilson",
      role: "Maritime Specialist",
      bio: "Ex-ship captain with extensive knowledge of vessel operations and compliance.",
      initials: "JW",
      social: {
        linkedin: "#",
        website: "#"
      }
    },
    {
      name: "Elena Rodriguez",
      role: "Head of Product",
      bio: "Product strategist focused on creating intuitive solutions for complex workflows.",
      initials: "ER",
      social: {
        linkedin: "#",
        website: "#"
      }
    },
  ]

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const hoverCard = {
    rest: { y: 0 },
    hover: { 
      y: -8,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 10 
      }
    }
  }

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
  <div className="container">
    <motion.div
      className="text-center mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
        Meet Our <span className="text-primary">Team</span>
      </h2>
      <motion.p
        className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        A passionate group of maritime experts and technology innovators working to transform the industry.
      </motion.p>
    </motion.div>

    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16" // Add margin-bottom here to create space
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {teamMembers.map((member, index) => (
        <motion.div
          key={index}
          variants={item}
          whileHover="hover"
          initial="rest"
          animate="rest"
        >
          <motion.div
            variants={hoverCard}
            className="h-full px-4"
          >
            <Card className="h-full p-6 text-center flex flex-col  items-center transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/10">
              <div className="mb-4 relative">
                {imagesLoaded ? (
                  <Avatar className="w-24 h-24">
                    <AvatarImage 
                      src={`/team/team-member-${index + 1}.webp`} 
                      alt={member.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Skeleton className="w-24 h-24 rounded-full" />
                )}
              </div>

              <h3 className="font-bold text-lg mb-1">{member.name}</h3>
              <p className="text-primary text-sm mb-3">{member.role}</p>
              <p className="text-muted-foreground text-sm mb-4 flex-grow">{member.bio}</p>

              <div className="flex gap-2">
                <Button variant="outline" size="icon" asChild>
                  <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href={member.social.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>

    {/* Optional CTA */}
    <motion.div
      className="mt-16 text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: 0.4 }}
    >
      <p className="text-muted-foreground mb-4">Want to join our crew?</p>
      <Button variant="outline">
        View Open Positions
      </Button>
    </motion.div>
  </div>
</section>

  )
}

export default OurTeam