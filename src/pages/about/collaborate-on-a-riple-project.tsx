import { GlobalNavBar } from "~/components/navbar/navbar";

export default function HowToCollaborate() {

  return (
    <>
      <main className="flex flex-col items-center w-full h-screen">
        <div id="nav-container" className="w-full">
          <GlobalNavBar />
        </div>

        <div className="flex justify-center w-full bg-sky-50 p-6">
            <div className="flex flex-col w-full md:w-3/5 p-4 border rounded-lg border-slate-700 space-y-6">
                <h1 className="text-3xl font-semibold">How to collaborate on Riple Projects</h1>

                <p className="text-lg"><strong>Last Updated: 05/09/23</strong></p>

                <section>
                    <h2 className="text-2xl font-semibold">Sample Heading</h2>
                    <p>Sample text:</p>
                    <ul className="list-disc list-inside">
                        <li><strong>Sample list:</strong> Item.</li>
                    </ul>
                </section>
            </div>
        </div>
      </main>
    </>
  );
}
