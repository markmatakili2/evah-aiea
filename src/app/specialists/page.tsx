
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { CheckCircle, Zap, DollarSign } from "lucide-react";
import { PlaceHolderImages } from '@/lib/placeholder-images';

const technicianBenefits = [
    { icon: <Zap className="w-5 h-5" />, text: "Flexible work schedule" },
    { icon: <CheckCircle className="w-5 h-5" />, text: "Access to a wide network of patients" },
    { icon: <DollarSign className="w-5 h-5" />, text: "Competitive compensation" },
];

const labBenefits = [
    { icon: <Zap className="w-5 h-5" />, text: "Increase your lab's sample volume" },
    { icon: <CheckCircle className="w-5 h-5" />, text: "Seamless integration with our platform" },
    { icon: <DollarSign className="w-5 h-5" />, text: "New revenue stream for your business" },
];

export default function SpecialistsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-headline font-bold">Partner with DigiLab Connect</h1>
            <p className="mt-4 text-xl max-w-3xl mx-auto text-primary-foreground/80">
              Join a growing network of healthcare professionals and facilities dedicated to making diagnostics more accessible.
            </p>
          </div>
        </section>

        <section id="technicians" className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-headline font-bold text-primary mb-4">For Lab Technicians</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Gain the flexibility to work on your own terms. As a freelance lab technician with DigiLab Connect, you can accept sample collection requests that fit your schedule and location, all while earning competitive rates.
                </p>
                <ul className="space-y-4 mb-8">
                  {technicianBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-muted-foreground">
                      <div className="bg-accent/20 text-accent p-2 rounded-full mr-3">{benefit.icon}</div>
                      <span>{benefit.text}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex space-x-4">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                    <Link href="/technician/register">Register as a Technician</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/technician/login">Log In</Link>
                  </Button>
                </div>
              </div>
              <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl">
                 <Image src={PlaceHolderImages[0].imageUrl} alt="Lab Technician" fill className="object-cover" data-ai-hint={PlaceHolderImages[0].imageHint} />
              </div>
            </div>
          </div>
        </section>

        <section id="labs" className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
               <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl md:order-2">
                 <Image src={PlaceHolderImages[1].imageUrl} alt="Medical Laboratory" fill className="object-cover" data-ai-hint={PlaceHolderImages[1].imageHint} />
              </div>
              <div className="md:order-1">
                <h2 className="text-3xl font-headline font-bold text-primary mb-4">For Lab Owners</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Maximize your lab's potential by partnering with DigiLab Connect. We provide a steady flow of samples, handling all the logistics from patient booking to result delivery, allowing you to focus on what you do best: analysis.
                </p>
                 <ul className="space-y-4 mb-8">
                  {labBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-muted-foreground">
                      <div className="bg-accent/20 text-accent p-2 rounded-full mr-3">{benefit.icon}</div>
                      <span>{benefit.text}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex space-x-4">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">Register Your Lab</Button>
                  <Button size="lg" variant="outline">Log In</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 text-center bg-background">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-headline font-bold text-primary">Ready to Join?</h2>
                <p className="mt-2 text-lg text-muted-foreground mb-6">Become a part of the future of diagnostics today.</p>
                <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="#contact">Contact Partnerships</Link>
                </Button>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
