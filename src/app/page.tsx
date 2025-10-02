import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  HeartPulse,
  FlaskConical,
  Stethoscope,
  Microscope,
  ShieldCheck,
  Clock,
  MapPin,
  TestTube,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    icon: <HeartPulse className="w-10 h-10 text-primary" />,
    title: 'Convenient Home Sampling',
    description: 'Our certified professionals collect samples from your doorstep.',
  },
  {
    icon: <FlaskConical className="w-10 h-10 text-primary" />,
    title: 'Accurate Lab Analysis',
    description: 'Samples are processed in our state-of-the-art partner labs.',
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-primary" />,
    title: 'Secure Digital Results',
    description: 'Access your results anytime, anywhere through our secure platform.',
  },
  {
    icon: <Clock className="w-10 h-10 text-primary" />,
    title: 'Fast Turnaround Time',
    description: 'Get your test results quickly so you can take timely action.',
  },
];

const specialists = [
  {
    image: PlaceHolderImages[0],
    name: 'Lab Technicians',
    description: 'Certified professionals looking for flexible work opportunities can join our network. Perform sample collections and analysis on your schedule.',
    link: '/specialists#technicians'
  },
  {
    image: PlaceHolderImages[1],
    name: 'Lab Owners',
    description: 'Partner with us to increase your lab\'s utilization. Get a steady stream of samples from our network of patients and technicians.',
    link: '/specialists#labs'
  },
];

const faqItems = [
    {
        question: "How do I book a test?",
        answer: "Simply create an account, log in to your dashboard, and click the 'Request a Test' button. You can then select the test you need, choose a collection method (home or lab visit), and schedule a convenient time."
    },
    {
        question: "Is home sample collection safe?",
        answer: "Absolutely. All our lab personnel are certified professionals who follow strict hygiene and safety protocols. All equipment is sanitized and single-use items are disposed of properly."
    },
    {
        question: "How long does it take to get my results?",
        answer: "Turnaround time varies depending on the test, but we prioritize speed and efficiency. You can track the progress of your test in real-time from the 'My Requests' page on your dashboard."
    },
    {
        question: "Are my personal data and results secure?",
        answer: "Yes, protecting your data is our top priority. We use end-to-end encryption and secure servers to ensure your personal information and health records are kept confidential and safe."
    }
]

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-card">
           <div className="absolute inset-0 bg-primary/5"></div>
           <div className="container mx-auto px-4 relative">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary mb-4 leading-tight">
                  Lab Testing, <br />
                  Simplified.
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto md:mx-0">
                  Get your lab tests done from the comfort of your home. Quick, reliable, and secure results at your fingertips.
                </p>
                <div className="flex justify-center md:justify-start space-x-4">
                  <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href="/register">Get Started</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-64 md:h-auto md:aspect-square flex items-center justify-center">
                <Image
                  src={PlaceHolderImages[2].imageUrl}
                  alt="Lab technician processing samples"
                  fill
                  className="object-cover rounded-2xl shadow-xl"
                  data-ai-hint={PlaceHolderImages[2].imageHint}
                />
              </div>
            </div>
           </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Why Choose DigiLab?</h2>
              <p className="mt-2 text-lg text-muted-foreground">Everything you need for hassle-free lab testing.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="items-center">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                        {feature.icon}
                    </div>
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-card">
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={PlaceHolderImages[3].imageUrl}
                      alt="Doctor reviewing results on a tablet"
                      fill
                      className="object-cover"
                      data-ai-hint={PlaceHolderImages[3].imageHint}
                    />
                </div>
                <div>
                    <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-4">Connecting Patients to Quality Care</h2>
                    <p className="text-muted-foreground text-lg mb-6">
                        DigiLab Connect was born from a simple idea: healthcare should be accessible and convenient. We bridge the gap between patients and diagnostic labs, empowering you to take control of your health without the stress of clinic visits.
                    </p>
                    <ul className="space-y-4 text-muted-foreground">
                        <li className="flex items-start">
                            <Stethoscope className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
                            <span><strong className="text-primary">For Patients:</strong> A seamless experience from booking to results, all from home.</span>
                        </li>
                        <li className="flex items-start">
                            <Microscope className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
                            <span><strong className="text-primary">For Specialists:</strong> A platform for certified lab personnel and labs to connect with patients and grow their practice.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        </section>

        {/* Specialists Section */}
        <section id="specialists" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Join Our Network of Professionals</h2>
              <p className="mt-2 text-lg text-muted-foreground">Are you a lab technician or a lab owner? Partner with us.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {specialists.map((specialist, index) => (
                <Card key={index} className="overflow-hidden shadow-lg">
                  <div className="relative h-48 w-full">
                    <Image src={specialist.image.imageUrl} alt={specialist.name} fill className="object-cover" data-ai-hint={specialist.image.imageHint} />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-headline font-bold text-primary mb-2">{specialist.name}</h3>
                    <p className="text-muted-foreground mb-4">{specialist.description}</p>
                    <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Link href={specialist.link}>Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Frequently Asked Questions</h2>
            </div>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index+1}`}>
                        <AccordionTrigger className="text-lg font-headline hover:no-underline text-left">{item.question}</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                        {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Get In Touch</h2>
                    <p className="mt-2 text-lg text-muted-foreground">Have questions? We're here to help.</p>
                </div>
                <Card className="max-w-2xl mx-auto p-2 shadow-lg">
                    <CardContent className="p-6">
                        <form className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Input placeholder="Your Name" />
                                <Input type="email" placeholder="Your Email" />
                            </div>
                            <Input placeholder="Subject" />
                            <Textarea placeholder="Your Message" rows={5} />
                            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Send Message</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
