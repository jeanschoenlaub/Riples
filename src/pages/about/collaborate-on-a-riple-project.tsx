import Image from 'next/image';
import { GlobalNavBar } from "~/features/navbar/navbar";

export default function HowToCollaborate() {
  return (
    <>
      <main className="flex flex-col items-center w-full h-screen">
        <div id="nav-container" className="w-full">
        <GlobalNavBar ToogleinBetween={true}></GlobalNavBar>
        </div>

        <div className="flex justify-center w-full bg-sky-50 p-6">
            <div className="flex flex-col w-full md:w-3/5 p-4 border rounded-lg border-slate-700 space-y-6">
                <h1 className="text-3xl font-semibold">How to Collaborate on Riples Projects</h1>

                <p className="text-lg"><strong>Last Updated: 17/09/23</strong></p>
                <p className="text-lg">This is far from ideal but somewhere to start. It&apos;s meant to be fun, feel free to try your hand and if it&apos;s not your thing no worries. Also it will get much easier than this as we go !</p>

                <section>
                    <h2 className="text-2xl font-semibold">Where to Find Tasks</h2>
                    <br></br>
                    <p>Follow these steps to locate tasks within a project:</p>
                    <ul className="list-disc list-inside">
                        <li>Navigate to the relevant project and click on the &apos;Collaborate&apos; tab.</li>
                        <li>Only projects marked as &apos;collab&apos; will have the &apos;Collaborate&apos; tab.</li>
                    </ul>
                    <br></br>
                    <div style={{ textAlign: 'center', border: '3px solid black'  }}>
                      <Image
                        src="/images/how-to-collab.jpeg"
                        alt="How to Collaborate"
                        width={700}
                        height={500}
                      />
                    </div>
                    <p><em>Fig: How to Collaborate</em></p>
                    <br></br>
                    <p> You will then be able to click &apos;Join the project&apos; which is a placehoder for a approval logic, but right now you will be accepted straight away</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold">How to Work on Existing Tasks</h2>
                    <br></br>
                    <p>To engage with an existing task, follow these steps:</p>
                    <ul className="list-disc list-inside">
                        <li> Review the list of tasks. You can click the taks title to find out more about it </li>
                        <li> If a taks has no owner, you can claim it by licking the title and clicking &apos;Ill do it&apos; on the pop-up.</li>
                        <li> Once claimed, click save button at the bottom. If you change your mind you can also remove yourself as the owner by click Quit</li>
                    </ul>
                    <br></br>
                    <div style={{ textAlign: 'center', border: '3px solid black'  }}>
                      <Image
                        src="/images/how-to-edit-tasks.jpeg"
                        alt="How to Edit Tasks"
                        width={700}
                        height={500}
                      />
                    </div>
                    <br></br>
                    <ul className="list-disc list-inside">
                        <li> So once you have clicked &apos;Ill do it&apos; button hit save and re-opened the task, </li>
                        <li> You can finally edit the task by clicking the edit button</li>
                        <li> Whats the purpose of editing  ? Well for others to be able to see the progress / what&apos;s being work on. You are now the owner of the task so feel free to rename it, change it completly .. it&apos;s yours</li>
                        <li> The rest should be pretty straight forward, but try save all your work even if you quit the owner role.</li>
                    </ul>
                    <br></br>
                    <div style={{ textAlign: 'center', border: '3px solid black'  }}>
                      <Image
                        src="/images/how-to-edit2.jpeg"
                        alt="How to Edit Tasks"
                        width={700}
                        height={500}
                      />
                    </div>
                    <p><em>Fig: How to Edit Tasks</em></p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold">How to Create Tasks</h2>
                    <br></br>
                    <p>Please do so ! Would be cool to see lots of ideas. You can create for yourself or others. Creating a new task is simple. Here&apos;s how:</p>
                    <ul className="list-disc list-inside">
                        <li>Click the &apos;Create&apos; button located at the top of the task list.</li>
                        <li>Fill in the task template and click &apos;Create Task&apos;.</li>
                        <li>If you&apos;re interested in completing the task, you can claim it right away.</li>
                    </ul>
                </section>
            </div>
        </div>
      </main>
    </>
  );
}
