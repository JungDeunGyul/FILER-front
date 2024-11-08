import { useQueryClient } from "@tanstack/react-query";

import LoadingMessage from "@components/LoadingMessage";
import ExploreTeam from "@pages/ExploreTeam";
import MyTeam from "@pages/MyTeam";

import type { User } from "userRelatedTypes";

function Home() {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData<User>(["userData"]);

  if (!userData) {
    return <LoadingMessage message="유저 정보를 불러오는 중입니다" />;
  }

  return (
    <div>{userData.teams.length === 0 ? <ExploreTeam /> : <MyTeam />}</div>
  );
}

export default Home;
