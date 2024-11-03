import { useEffect, useState } from "react";

export const useCurrentTeam = (userData, teamId) => {
  const [currentTeam, setCurrentTeam] = useState(null);
  const [currentUserRole, setUserRole] = useState("");

  useEffect(() => {
    const team = userData.teams.find((team) => team._id === teamId);

    if (team) {
      setCurrentTeam(team);
      const currentUser = team.members.find(
        (user) => user.user.nickname === userData.nickname,
      );
      setUserRole(currentUser ? currentUser.role : "");
    }
  }, [userData, teamId]);

  return { currentTeam, currentUserRole };
};
