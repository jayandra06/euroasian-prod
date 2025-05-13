import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Check } from 'lucide-react'
import { useForm } from 'react-hook-form'

const RequestDemo = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm()

  const onSubmit = async (data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log('Form submitted:', data)
    reset()
  }

  const fleetSize = watch('fleetSize')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const formVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <section id="demo" className="relative py-20 overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 opacity-5 bg-[url('/wave-pattern.webp')] bg-repeat" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
      <div className="container relative z-10">
        <motion.div
          className="flex flex-col items-center gap-12 md:flex-row"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {/* Left content */}
          <motion.div className="md:w-1/2" variants={itemVariants}>
            <motion.h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl" whileHover={{ scale: 1.02 }}>
              Ready to Transform Your Maritime Operations?
            </motion.h2>
            <motion.p className="mt-4 text-lg opacity-90" variants={itemVariants}>
              Schedule a personalized demo to see how Euroasiann can streamline your operations, reduce costs, and
              improve efficiency across your entire fleet.
            </motion.p>
            <motion.ul className="mt-6 space-y-3" variants={containerVariants}>
              {[
                'Personalized platform walkthrough',
                'Custom implementation roadmap',
                'ROI calculation for your fleet',
                'Dedicated support team',
                '30-day trial available',
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-center gap-3"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center justify-center rounded-full bg-white/20 p-1.5">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span>{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Right form */}
          <motion.div
            className="w-full p-8 rounded-lg shadow-xl bg-background text-foreground md:w-1/2"
            variants={formVariants}
            whileHover={{ y: -5 }}
          >
            <motion.h3
              className="mb-6 text-2xl font-bold text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Request Your Demo
            </motion.h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">First name</label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    {...register('firstName', { required: 'First name is required', minLength: { value: 2, message: 'Minimum 2 characters' } })}
                    className={errors.firstName ? 'border-destructive' : ''}
                  />
                  {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">Last name</label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    {...register('lastName', { required: 'Last name is required', minLength: { value: 2, message: 'Minimum 2 characters' } })}
                    className={errors.lastName ? 'border-destructive' : ''}
                  />
                  {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium">Company</label>
                <Input
                  id="company"
                  placeholder="Enter your company name"
                  {...register('company', { required: 'Company is required', minLength: { value: 2, message: 'Minimum 2 characters' } })}
                  className={errors.company ? 'border-destructive' : ''}
                />
                {errors.company && <p className="text-sm text-destructive">{errors.company.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register('email', { required: 'Email is required' })}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="fleetSize" className="text-sm font-medium">Fleet size</label>
                <Select
                  onValueChange={(value) => setValue('fleetSize', value, { shouldValidate: true })}
                  defaultValue={fleetSize}
                >
                  <SelectTrigger className={errors.fleetSize ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select fleet size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 vessels</SelectItem>
                    <SelectItem value="6-20">6-20 vessels</SelectItem>
                    <SelectItem value="21-50">21-50 vessels</SelectItem>
                    <SelectItem value="50+">50+ vessels</SelectItem>
                  </SelectContent>
                </Select>
                {errors.fleetSize && <p className="text-sm text-destructive">{errors.fleetSize.message}</p>}
              </div>

              <input type="hidden" {...register('fleetSize', { required: 'Please select your fleet size' })} />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <svg
                      className="w-4 h-4 mr-2 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Request Demo'
                )}
              </Button>

              <motion.p
                className="text-xs text-center text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                By submitting this form, you agree to our{' '}
                <a href="#" className="underline hover:text-primary">privacy policy</a> and{' '}
                <a href="#" className="underline hover:text-primary">terms of service</a>.
              </motion.p>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default RequestDemo
