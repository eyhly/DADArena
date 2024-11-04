import { useState, useEffect } from "react";

const useRoles = () => {
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const storedRoles = localStorage.getItem("roles");
    if (storedRoles) {
      //set roles 
      setRoles(JSON.parse(storedRoles));
    }
  }, []);

  return roles;
};

export default useRoles;
