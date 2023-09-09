import type { RouterOutputs } from "~/utils/api"

type project = RouterOutputs["projects"]["getProjectByProjectId"]["project"]
export const NotionEmbed = (props: project) => {
    return(
        <div className=" flex items-center justify-center">
            {props.notionEmbedUrl && <iframe src={props.notionEmbedUrl}></iframe>}
        </div>
    )
}