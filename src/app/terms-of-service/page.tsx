
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary text-center">
              Terms of Service
            </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-primary prose-headings:font-headline">
            <p className="text-sm text-muted-foreground text-center">Last Updated: {new Date().toLocaleDateString()}</p>
            
            <h2>1. Introduction</h2>
            <p>
              Welcome to DigiLab Connect ("we", "us", "our"). These Terms of Service govern your use of our website and mobile application (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these terms.
            </p>

            <h2>2. Definition of Terms</h2>
            <ul>
              <li><strong>Service:</strong> Refers to the DigiLab Connect platform, including our website, applications, and all related services.</li>
              <li><strong>User:</strong> Anyone who accesses or uses our Service, including Patients, Lab Personnel, and Lab Owners.</li>
              <li><strong>Patient:</strong> A User who requests laboratory testing services.</li>
              <li><strong>Lab Personnel / Medical Lab Officer:</strong> A certified professional who performs sample collection and/or analysis.</li>
              <li><strong>Lab Partner:</strong> A clinical laboratory registered with DigiLab Connect to perform test analysis.</li>
            </ul>

            <h2>3. Service Provision</h2>
            <p>
              DigiLab Connect provides a platform to connect Patients with Lab Personnel and Lab Partners for the purpose of requesting, performing, and receiving results for diagnostic laboratory tests. We are not a healthcare provider and do not offer medical advice.
            </p>

            <h2>4. Payments, Cancellations, and Refunds</h2>
            <ul>
              <li><strong>No Refund After Sample Collection:</strong> There shall be no refund of any monies after a sample has been collected by the assigned Medical Lab Officer.</li>
              <li><strong>Cancellation Fee:</strong> A charge of 45% of the test cost price shall be applied for cancelling a test after DIGI-LAB SOLUTIONS LTD has allocated a Medical Lab Officer to the request.</li>
              <li><strong>Change of Location:</strong> Plans to change the location of sample collection must be communicated at least 15 minutes prior to the scheduled time. Failure to do so will attract a 20% penalty on the test cost price.</li>
              <li><strong>System Failure:</strong> A complete cashback will be performed by DIGI-LAB SOLUTIONS LTD in the event of a system failure that prevents the fulfillment of the service.</li>
              <li><strong>Patient's Demise:</strong> In the unfortunate event of a patient's demise before the service is completed, a cashback shall be promptly pursued upon verification.</li>
            </ul>

            <h2>5. Penalties for Service Providers</h2>
            <ul>
                <li><strong>Delay by Personnel:</strong> A 10% penalty fee will be charged on the Medical Lab Officer for any delay in locating the client within a window of 15 minutes from the scheduled appointment time.</li>
                <li><strong>Lab Inconvenience:</strong> 10% of the cost of the test will be charged on any clinical lab registered with DIGI-LAB SOLUTIONS LTD for any inconvenience in conducting the requested lab investigation. This rule is exclusive of circumstances limited to natural calamities or other force majeure events.</li>
            </ul>

            <h2>6. User Obligations</h2>
            <p>
                You agree to provide accurate and complete information when registering and using our Service. You are responsible for maintaining the confidentiality of your account and password.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              The Service is provided "as is" without any warranties. DIGI-LAB SOLUTIONS LTD shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the Service. Our liability is limited to the maximum extent permitted by law.
            </p>
            
            <h2>8. Governing Law</h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which DIGI-LAB SOLUTIONS LTD operates, without regard to its conflict of law provisions.
            </p>

            <h2>9. Changes to Terms</h2>
            <p>
                We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new Terms of Service on this page. Your continued use of the Service after any such changes constitutes your acceptance of the new terms.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us through the "Get In Touch" section on our homepage.
            </p>

          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
