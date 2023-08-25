import Link from "next/link";
import { GlobalNavBar } from "~/components/navbar";

export default function AboutRiples() {

  return (
    <>
      <main className="flex flex-col items-center w-full h-screen">
        <div id="nav-container" className="w-full">
          <GlobalNavBar />
        </div>

        <div className="flex justify-center w-full bg-sky-50 p-6">
          <div className="flex flex-col w-full md:w-3/5 p-4 border rounded-lg border-slate-700 space-y-6">
            <h1 className="text-3xl font-semibold">About Riples</h1>
            <p>Welcome to Riples - A platform to turn ideas into realities together.</p>

            <section>
              <h2 className="text-2xl font-semibold">Our Mission</h2>
              <p>At Riples, we're on a mission to empower individuals and teams to turn their collaborative dreams into reality. Whether you're a startup founder, an experienced professional, or just friends with a crazy idea, Riples provides the platform and tools you need to bring your projects to life in a supportive and engaging community.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Our Vision</h2>
              <p>Our vision is to create a global ecosystem where collaboration knows no boundaries. We believe that innovation thrives when diverse minds come together. That's why Riples is designed to be a hub where creators, developers, and dreamers can connect, collaborate, and make waves together.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">What Sets Us Apart</h2>
              <p>With Riples, you can share and follow ideas, and work with people from around the world seamlessly, all within a user-friendly interface. From tech startups to creative endeavors, Riples welcomes a diverse range of projects.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Join the Movement</h2>
              <p>Are you ready to join a community that's redefining collaboration? Whether you have a groundbreaking idea or just want to follow innovative projects through our platform, Riples is the place to connect with like-minded individuals. Start your journey with us today!</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Legal</h2>
              <p>Please make sure to read our <Link  href="about/terms-of-service">Terms of Service</Link> and <Link href="about/privacy-policy">Privacy Policy</Link>.</p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}