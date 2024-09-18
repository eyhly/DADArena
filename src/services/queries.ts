import { useQueries, useQuery } from "@tanstack/react-query";
import {
  getAllEvents,
  getEvent,
  getSport,
  useUserInfo,
  getAllSports,
  getAllTeams,
  getTeam,
  getAllMatches,
} from "./api";

// get user login
export function useUserLogin() {
  return useQueries({
    queries: [
      {
        queryKey: ["userinfo"],
        queryFn: useUserInfo,
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


// // get all sports
// export function useGetAllSports() {
//   return useQuery({
//     queryKey: ["sports"],
//     queryFn: getAllSports, 
//   });
// }

export function useGetAllSports(eventId: string) {
  return useQuery({
    queryKey: ["sports", eventId], 
    queryFn: () => getAllSports(eventId), 
    enabled: !!eventId, 
  });
}

// get sport by ID
export function useSport(id: string | undefined) {
  return useQuery({
    queryKey: ["sport", id],
    queryFn: () => getSport(id!), 
    
  });
}

export const useSportDetails = (sportId: string) => {
  return useQuery({
    queryKey: ["sportDetails", sportId],
    queryFn: () => getSport(sportId),
    enabled: !!sportId, 
  });
};

//get all teams 
export function useGetAllTeams(eventId: string){
  return useQuery({
    queryKey: ['teams', eventId],
    queryFn: () => getAllTeams(eventId),
    enabled: !!eventId,
  });
}

//get team by id
export function useTeam(id: string | undefined) {
  return useQuery({
    queryKey: ['team', id],
    queryFn: () => getTeam(id!),
  })
}

// //get all matches
// export function useGetAllMatches(eventId: string, sportId: string) {
//   return useQuery({
//     queryKey: ["matches", eventId, sportId],
//     queryFn: () => getAllMatches(eventId, sportId),
//     enabled: !!eventId && !!sportId,
//   });
// }
//get all matches
export function useGetAllMatches(eventId: string) {
  return useQuery({
    queryKey: ["matches", eventId],
    queryFn: () => getAllMatches(eventId),
    enabled: !!eventId,
  });
}