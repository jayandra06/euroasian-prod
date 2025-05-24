import React from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Skeleton } from '../ui/skeleton'
import { Card } from '../ui/card'
import { Linkedin, Globe } from 'lucide-react'
import { Button } from '../ui/button'

const OurTeam = () => {
  const [imagesLoaded, setImagesLoaded] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setImagesLoaded(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const teamMembers = [
    {
      name: "Sravann Pabbaraju",
      role: "Founder",
      bio: "10+ years in the shipping industry with deep expertise in global maritime operations.",
      initials: "SP",
      social: {
        linkedin: "#",
        website: "#"
      }
    },
    {
      name: "Sreenu Kambala",
      role: "Co Founder",
      bio: "Leads administration and internal operations, ensuring smooth day-to-day functioning.",
      initials: "SK",
      social: {
        linkedin: "#",
        website: "#"
      }
    }
  ]

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
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            A passionate leadership duo blending maritime expertise with strong administrative execution.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-start"
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
                <Card className="h-full p-6 text-center flex flex-col items-center transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/10">
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
                  <p className="text-muted-foreground text-sm mb-4 flex-grow">
                    {member.bio}
                  </p>

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
