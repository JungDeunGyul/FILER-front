import useUserStore from "../store/userData";

function MyTeam() {
  const { userData } = useUserStore();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      My Team
    </div>
  );
}

export default MyTeam;
