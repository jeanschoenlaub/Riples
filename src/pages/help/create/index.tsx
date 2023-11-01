import Link from "next/link";
import { FocusLayout } from "~/layout/focus-layout";

export default function HelpIndex() {
    return (
        <>
        <FocusLayout ToogleinBetween={true}>
        <div className="flex mt-8 ml-4">
            <ul className="list-decimal pl-5">
                <li className="mb-2">
                    <Link href="/help/create/article1" className="text-blue-500 hover:underline cursor-pointer">
                        How to create a project
                    </Link>
                </li>
                <li>
                    <Link href="/help/create/article1" className="text-blue-500 hover:underline cursor-pointer">
                        How to change privacy and visibility of a project
                    </Link>
                </li>
            </ul>
        </div>

        </FocusLayout>
        </>
    );
}
