import type { RouterOutputs } from "~/utils/api"

type fakeData = RouterOutputs["projects"]["getProjectByProjectId"]
export const NotionEmbed = (props: fakeData) => {
    return(
        <div className=" flex items-center justify-center">
            {props.project.notionEmbedUrl && <iframe src={props.project.notionEmbedUrl}></iframe>}
        </div>
    )
}