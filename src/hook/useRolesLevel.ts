import { useState, useEffect } from "react";

const useRolesLevel = () => {
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const storedRoles = localStorage.getItem("roles");
    if (storedRoles) {
      //set roles
      setRoles(JSON.parse(storedRoles));
    };
  }, []);

  const checkRole = (item: string, value?: string) => {
    if (value) {
      return roles.some((val) => val.includes(item) || val.includes(value));
    }
    return roles.includes(item);
  };

  return {
    isCaptain: checkRole("captain"),
    isMember: checkRole("member"),
    isAdmin: checkRole("committee"),
    isOfficial: checkRole("official"),
    isOrganizer: checkRole("official", "committee"),
    isUser: checkRole("member", "captain")
  };
};

export default useRolesLevel;
