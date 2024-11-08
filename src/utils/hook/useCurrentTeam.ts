import { useEffect, useState } from "react";
import { User, Teams } from "userRelatedTypes";

export const useCurrentTeam = (userData: User, teamId: string) => {
  const [currentTeam, setCurrentTeam] = useState<Teams | null>(null);
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
