import { api } from "~/utils/api";
import { SocialFeed } from "~/features/feeds/social-feed";  // Rename to avoid naming conflicts
import { CreateFeed } from "~/features/feeds/create-feed"; // Assume you have a CreateFeed component
import { useState } from "react";
import { useRouter } from "next/router";
import { FeedLayout } from "~/layout/feed-layout";

export default function Home() {
  //Start this query asap
  api.projects.getAll.useQuery();

  const router = useRouter();
  //We either have initial state on first land or can be changed from childs or via router pushes
  const [activeTab, setActiveTab] = useState<string>(() => {
    const tabFromQuery = Array.isArray(router.query.activeTab)
      ? router.query.activeTab[0]
      : router.query.activeTab;

    return tabFromQuery ?? "Social";
  });
  
  return (
    <>
      <FeedLayout activeTab={activeTab} setActiveTab={setActiveTab} ToogleinBetween={false}>
          {activeTab === "Social" ? <SocialFeed /> : <CreateFeed />}
      </FeedLayout>
    </>
  );
}
