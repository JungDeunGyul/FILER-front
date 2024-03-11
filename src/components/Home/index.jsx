import useUserStore from "../store/userData";
import ExploreTeam from "../ExploreTeam";
import MyTeam from "../MyTeam";

function Home() {
  const { userData } = useUserStore();

  return (
    <div>{userData.teams.length === 0 ? <ExploreTeam /> : <MyTeam />}</div>
  );
}

export default Home;
