import React from 'react';
import dayjs from 'dayjs';
import { RouterOutputs } from '~/utils/api';

type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"]
const AboutTab = (props: ProjectData) => {
  const {project, author} = props;
  return (
    <div id="proj-about-html" className="mt-4">
      <div>
        {project.summary}
      </div>
      <div>
        <p className="italic mt-2 text-sm text-gray-600">
          Created {dayjs(project.createdAt).format('DD/MM/YYYY')}
        </p>
      </div>
      <div>
        <p className="text-lg font-bold">
          Project Lead:
        </p>
        <p className="text-base">
          {author.firstName} {/* Adjust how the authorId is displayed */}
        </p>
      </div>
    </div>
  );
};

export default AboutTab;