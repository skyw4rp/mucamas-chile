import {
  BookingForm,
  ExpressSection,
  FAQ,
  Footer,
  Header,
  Hero,
  HowItWorks,
  Reviews,
  Services,
  WhyChoose,
} from "@/components/landing";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <ExpressSection />
        <HowItWorks />
        <WhyChoose />
        <Reviews />
        <FAQ />
        <BookingForm />
      </main>
      <Footer />
    </>
  );
}
