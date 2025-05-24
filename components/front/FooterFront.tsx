import { Mail, MapPin, Phone, Ship } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Separator } from './ui/separator'

const FooterFront = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  const socialLinks = [
    { name: 'Twitter', url: '#' },
    { name: 'LinkedIn', url: '#' },
    { name: 'Facebook', url: '#' },
    { name: 'Instagram', url: '#' }
  ]

  return (
    <footer className="bg-background border-t">
      <div className="container px-4 py-12 md:py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {/* Company Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-3">
              <Ship className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">EuroAsian</span>
            </div>
            <p className="text-muted-foreground">
              Revolutionizing maritime operations with our all-in-one ERP platform for the modern shipping industry.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <Button key={link.name} variant="ghost" size="icon" asChild>
                  <Link href={link.url} aria-label={link.name}>
                    <span className="sr-only">{link.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {['About Us', 'Services', 'Case Studies', 'Pricing'].map((item) => (
                <li key={item}>
                  <Button variant="link" className="text-muted-foreground px-0" asChild>
                    <Link href="#">{item}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              {['Blog', 'Documentation', 'API Reference', 'Community'].map((item) => (
                <li key={item}>
                  <Button variant="link" className="text-muted-foreground px-0" asChild>
                    <Link href="#">{item}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Newsletter */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-muted-foreground">
              Subscribe to our newsletter for the latest updates and insights.
            </p>
            <form className="flex gap-2">
              <Input type="email" placeholder="Your email" className="flex-1" />
              <Button type="submit">Subscribe</Button>
            </form>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@euroasianngroup.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span>+49 1521 9712961</span>
              </div>
             


              <div className="space-y-2">
  <div className="flex items-start gap-3">
    <MapPin className="h-5 w-5 text-blue-500 mt-1" />
    <span>Teerosenweg 46, 22177 Hamburg, Germany</span>
  </div>
  <div className="flex items-start gap-3">
    <MapPin className="h-5 w-5 text-blue-500 mt-1" />
    <span>
      3rd Floor, A321, Master Mind 4, Royal Palms, Goregaon East, Mumbai-400065, India
    </span>
  </div>
</div>



              
            </div>
          </motion.div>
        </motion.div>

        <Separator className="my-8" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground"
        >
          <p>© {new Date().getFullYear()} EuroAsian. All rights reserved.</p>
          <div className="flex gap-4">
            <Button variant="link" className="text-muted-foreground p-0 h-auto" asChild>
              <Link href="#">Privacy Policy</Link>
            </Button>
            <Button variant="link" className="text-muted-foreground p-0 h-auto" asChild>
              <Link href="#">Terms of Service</Link>
            </Button>
            <Button variant="link" className="text-muted-foreground p-0 h-auto" asChild>
              <Link href="#">Cookie Policy</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default FooterFront
