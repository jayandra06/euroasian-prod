import { NavigationProvider } from "../../components/front/Navigation"
import Header from "../../components/front/Header"
import Footer from "../../components/front/Footer"
import ContactForm from "../../components/front/ContactForm"

export default function Contact() {
  return (
    <NavigationProvider>
      <div className="flex flex-col min-h-screen dark">
        <Header />
        <main className="flex-grow">
          <ContactForm />
        </main>
        <Footer />
      </div>
    </NavigationProvider>
  )
}

