import Link from "next/link";
import { FocusLayout } from "~/layout/focus-layout";
import { MultiUserSVG, MagicWandSVG, ShareSVG, TaskSVG } from "~/components/";

type HelpCardProps = {
    title: string;
    description: string;
    IconComponent: React.ReactNode;
    color: string;
    path: string;
}

function HelpCard({ title, description, IconComponent, color = "#3b82f6", path }: HelpCardProps) {
    return (
        <Link href={path}>
        <div className="border-2 border-gray-300 rounded-lg p-4 shadow-lg dark:border-gray-600">
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                <div style={{ backgroundColor: color }} className="w-10 h-10 rounded-lg flex items-center justify-center">
                    {IconComponent}
                </div>
            </div>
            <h3 className="mb-2 text-xl font-bold dark:text-white">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        </Link>
    );
}

export default function HelpIndex() {
    return (
        <>
            <FocusLayout ToogleinBetween={true}>
            <div className="p-4">
            <h2 className="mb-6 mt-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white"> Help and Tutorials.</h2>
                <div className="space-y-8 mr-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
                    <HelpCard 
                         title="Create and Manage a project"
                         description="Learn how to start a new project and manage its contents."
                         IconComponent={<TaskSVG width="5" height="5" colorStrokeHex="#3b82f6"/>}
                         color="#bfdbfe"
                         path="/help/create"
                    />
                    <HelpCard 
                        title="Share"
                        description="Discover the ways to share your project with others."
                        IconComponent={<ShareSVG  width="5" height="5" colorStrokeHex="#3b82f6"/>}
                        color="#bfdbfe"
                        path="/help/create/"
                    />
                    <HelpCard 
                        title="Collaborate"
                        description="Collaborate with team members in real-time. Edit, comment, and more."
                        IconComponent={<MultiUserSVG  width="5" height="5" colorFillHex="#3b82f6"/>}
                        color="#bfdbfe"
                        path="/help/create/"
                    />
                    <HelpCard 
                        title="AI enhanced"
                        description="How to use mister Watt effectively."
                        IconComponent={<MagicWandSVG width="5" height="5" colorStrokeHex="#3b82f6"/>}
                        color="#bfdbfe"
                        path="/help/create/"
                    />
                </div>
                </div>
            </FocusLayout>
        </>
    );
}
