import { useQueryClient } from "@tanstack/react-query";

import ExploreTeam from "./ExploreTeam";
import MyTeam from "./MyTeam";

function Home() {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["userData"]);

  return (
    <div>{userData.teams.length === 0 ? <ExploreTeam /> : <MyTeam />}</div>
  );
}

export default Home;
