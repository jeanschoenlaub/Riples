import { GlobalNavBar } from "~/components/navbar";


export default function PrivacyPolicy() {

    return (
        <>
          <main className="flex flex-col items-center w-full h-screen">
            <div id="nav-container" className="w-full">
              <GlobalNavBar />
            </div>
    
            <div className="flex justify-center w-full bg-sky-50 p-6">
              
              <div className="flex flex-col w-full md:w-3/5 p-4 border rounded-lg border-slate-700 space-y-6">
                <h1 className="text-3xl font-semibold">Terms of Service for Riples</h1>
    
                <p className="text-lg"><strong>Last Updated: 25/08/23</strong></p>
    
                <section>
                  <h2 className="text-2xl font-semibold">Acceptance of Terms</h2>
                  <p>By accessing or using Riples, you agree to comply with and be bound by these Terms of Service.</p>
                </section>
    
                <section>
                  <h2 className="text-2xl font-semibold">Use of Service</h2>
                  <p>You agree to use the service in compliance with all applicable laws and regulations.</p>
                </section>
    
                <section>
                  <h2 className="text-2xl font-semibold">User Conduct</h2>
                  <p>You agree to act responsibly and not to engage in any activity that could be deemed illegal or harmful.</p>
                </section>
    
                <section>
                  <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
                  <p>We are not responsible for any damages or losses incurred while using our service.</p>
                </section>
    
                <section>
                  <h2 className="text-2xl font-semibold">Modification of Terms</h2>
                  <p>We reserve the right to modify or replace these terms at any time. It is your responsibility to review these terms periodically.</p>
                </section>
    
                <section>
                  <h2 className="text-2xl font-semibold">Privacy</h2>
                  <p>Your use of Riples is subject to our Privacy Policy, which outlines how we handle your data.</p>
                </section>
    
                <section>
                  <h2 className="text-2xl font-semibold">Termination</h2>
                  <p>We reserve the right to suspend or terminate your access to Riples at our sole discretion, without notice, for conduct that we believe violates these terms or is harmful to other users, us, or third parties.</p>
                </section>
    
                <section>
                  <h2 className="text-2xl font-semibold">Contact Us</h2>
                  <p>If you have any questions about these Terms of Service, please contact us at admin@riples.app.</p>
                </section>
              </div>
            </div>
          </main>
        </>
      );
    }