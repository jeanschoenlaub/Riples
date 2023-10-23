//import Link from "next/link";
import Link from "next/link";
import { GlobalNavBar } from "~/components/navbar/navbar";

export default function AboutRiples() {

  return (
    <>
      <main className="flex flex-col items-center w-full h-screen">
        <div id="nav-container" className="w-full">
        <GlobalNavBar ToogleinBetween={true}></GlobalNavBar>
        </div>

        <div className="flex justify-center w-full bg-sky-50 p-6">
          <div className="flex flex-col w-full md:w-3/5 p-4 border rounded-lg border-slate-700 space-y-6">
            <h2 className="text-2xl font-semibold ">About Riples</h2>
            <p> Riples is a platform where you can host you projects, collaborate in other public projects and share with a vibrant community</p>


            <section>
              <h2 className="font-semibold">Our Mission</h2>
              <p>At Riples, we&apos;re on a mission to empower individuals and teams to turn their visions into reality. Whether you&apos;re an aspiring startup founder, looking to get real-life experience in coding, or want to follow your friends on their creative adventures, Riples is the platform you need to bring your projects to life in a supportive and engaging community.</p>
            </section>

            <section>
              <h2 className="font-semibold">Our Vision</h2>
              <p> We believe that innovation thrives when diverse minds come together, and that long lasting relationships can be  . That&apos;s why Riples is designed to be a hub where creators, developers, and dreamers can connect, collaborate, and make waves together.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">What Sets Us Apart</h2>
              <h2 className="font-semibold mt-4">A Platform Empowering Collaboration</h2>
              <p>With Riples, you can share and follow ideas, and work with people from around the world seamlessly, all within a user-friendly interface. From tech startups to creative endeavors, Riples welcomes a diverse range of projects.</p>
              
              <h2 className="font-semibold mt-4">Infrastructure for Seamless Creation</h2>
              <p>Crafting the future should be exhilarating, not encumbered. At Riples, we are building a platform that stands as your unwavering foundation. From inception to execution, we provide the infrastructure and resources to streamline your project journey. </p>
              
              <h2 className="font-semibold mt-4">We Will Build Riples Collaboratively</h2>
              <p>And we&apos;re not just about talking the talk, we&apos;re walking the collaborative walk. We believe so strongly in the power of collaboration that we&apos;re using Riples to build Riples. But we&apos;re not doing it alone, we invite you to be a part of this journey. Your contributions, feedback, and insights are not just welcome, they&apos;re essential. You have the unique opportunity to help shape the platform you use, ensuring it evolves in a way that best serves your needs and aspirations. Let&apos;s build the future of collaboration together, one ripple at a time. </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Join the Movement</h2>
              <p>Are you ready to join a community that&apos;s redefining collaboration? Whether you have a groundbreaking idea or just want to follow innovative projects through our platform, Riples is the place to connect with like-minded individuals. Start your journey with us today! Let us know what you think about the Riples app <Link href="https://forms.gle/WPq2stK3YBDcggHw5" className="text-blue-500">
                    here
                </Link>  </p>
            </section>

            {/*
            <section>
                <h2 className="text-2xl font-semibold mb-2">Legal</h2>
                <p>
                Please make sure to read our{" "}
                <Link href="/about/terms-of-service" className="text-blue-500">
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/about/privacy-policy" className="text-blue-500">
                    Privacy Policy
                </Link>
                .
                </p>
            </section> */}
          </div>
        </div>
      </main>
    </>
  );
}