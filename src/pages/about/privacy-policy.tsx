import { GlobalNavBar } from "~/components/navbar";
import Link from "next/link";

export default function PrivacyPolicy() {

  return (
    <>
      <main className="flex flex-col items-center w-full h-screen">
        <div id="nav-container" className="w-full">
          <GlobalNavBar />
        </div>

        <div className="flex justify-center w-full bg-sky-50 p-6">
          
          <div className="flex flex-col w-full md:w-3/5 p-4 border rounded-lg border-slate-700 space-y-6">
            <h1 className="text-3xl font-semibold">Privacy Policy for Riples</h1>

            <p className="text-lg"><strong>Last Updated: 25/08/23</strong></p>

            <section>
              <h2 className="text-2xl font-semibold">Introduction</h2>
              <p>Welcome to Riples&apos; Privacy Policy. Your privacy is important to us, and this policy outlines how we collect, use, disclose, and protect your information.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Information We Collect</h2>
              <p>We may collect the following types of information:</p>
              <ul className="list-disc list-inside">
                <li><strong>Personal Information:</strong> Such as names, email addresses, and other information that identifies you.</li>
                <li><strong>Usage Information:</strong> Such as how you interact with our services, the content you view, and the data you send and receive.</li>
                <li><strong>Technical Information:</strong> Such as IP addresses, device types, and browser types.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">How We Use the Information</h2>
              <p>We may use the information for:</p>
              <ul className="list-disc list-inside">
                <li>Providing and improving our services.</li>
                <li>Communicating with you, including newsletters and promotional materials.</li>
                <li>Troubleshooting and enhancing user experience.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Sharing and Disclosure</h2>
              <p>We may share information:</p>
              <ul className="list-disc list-inside">
                <li>To comply with the law or legal proceedings.</li>
                <li>With third parties that help us provide and improve our services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Data Security</h2>
              <p>We implement various security measures to protect your information.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Third-Party Services</h2>
              <p>We may link to third-party services or use third-party integrations. We are not responsible for the privacy policies or practices of such services.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Cookies</h2>
              <p>We use cookies for various purposes, including to help improve your user experience.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Children&apos;s Privacy</h2>
              <p>Our services are not intended for individuals under the age of 18.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold">Data Deletion</h2>
                <p>If you wish to delete your data from Riples, you can do so by signing in to your account. Once signed in, navigate to your user profile (either click on your profile picture, or {" "}
                <Link  href="/user-profile" className="text-blue-500">HERE</Link> ). At the bottom of the profile page, you will find an option to &apos;Delete Account&apos;. Clicking this will remove all data we have stored about you.</p>
                <p>Please note that some data may still be retained for compliance with legal obligations.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Changes to This Privacy Policy</h2>
              <p>We may update this Privacy Policy. Changes will be reflected on this page, and we will update the &quot;Last Updated&quot; date at the top.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Contact Us</h2>
              <p>For any questions or concerns, please contact us at admin@riples.app.</p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
