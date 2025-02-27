import { NavigationProvider } from "../../components/front/Navigation"
import Header from "../../components/front/Header"
import Footer from "../../components/front/Footer"
import AboutUs from "../../components/front/AboutUs"

export default function About() {
  return (
    <NavigationProvider>
      <div className="flex flex-col min-h-screen dark">
        <Header />
        <main className="flex-grow">
          <AboutUs />
        </main>
        <Footer />
      </div>
    </NavigationProvider>
  )
}

