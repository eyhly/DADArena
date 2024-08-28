import { useQueries, useQuery } from "@tanstack/react-query";
import {
  getAllEvents,
  getEvent,
  getSport,
  getUserInfo,
  getAllSports,
} from "./api";

// get user login
export function useUserLogin() {
  return useQueries({
    queries: [
      {
        queryKey: ["userinfo"],
        queryFn: getUserInfo,
      },
    ],
  });
}

// get all events
export function useGetAllEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: getAllEvents, 
  });
}

// get event by ID
export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => getEvent(id!), 
    
  });
}


// get all sports
export function useGetAllSports() {
  return useQuery({
    queryKey: ["sports"],
    queryFn: getAllSports, 
  });
}

// get sport by ID
export function useSport(id: string | undefined) {
  return useQuery({
    queryKey: ["sport", id],
    queryFn: () => getSport(id!), 
    
  });
}
