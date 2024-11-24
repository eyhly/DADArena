import {  useQuery } from "@tanstack/react-query";
import 
  useApi
from "./api";
import { UserResponse } from "../types/user";

// get user login
export function useGetUserInfo(pageNumber: number, pageSize?: number) {
  const {getUserInfo} = useApi();
  return useQuery<UserResponse>({
    queryKey: ["users", pageNumber],
    queryFn: () => getUserInfo(pageNumber, pageSize),
  })
}

// get all events
export function useGetAllEvents() {
  const {getAllEvents} = useApi();
  return useQuery({
    queryKey: ["events"],
    queryFn: getAllEvents, 
  });
}

// get event by ID
export function useEvent(id: string | undefined) {
  const {getEvent} = useApi();
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => getEvent(id!), 
    enabled: !!id,
  });
}


// // get all sports
export function useGetAllSports(eventId: string) {
  const {getAllSports} = useApi()
  return useQuery({
    queryKey: ["sports", eventId], 
    queryFn: () => getAllSports(eventId), 
    enabled: !!eventId, 
  });
}

// get sport by ID
export function useSport(id: string | undefined) {
  const {getSport} = useApi();
  return useQuery({
    queryKey: ["sport", id],
    queryFn: () => getSport(id!), 
    
  });
}

export const useSportDetails = (sportId: string) => {
  const {getSport} = useApi();
  return useQuery({
    queryKey: ["sportDetails", sportId],
    queryFn: () => getSport(sportId),
    enabled: !!sportId, 
  });
};

//get all teams 
export function useGetAllTeams(eventId: string){
  const {getAllTeams} = useApi();
  return useQuery({
    queryKey: ['teams', eventId],
    queryFn: () => getAllTeams(eventId),
    enabled: !!eventId,
  });
}

//get team by id
export function useTeam(id: string | undefined) {
  const {getTeam} = useApi();
  return useQuery({
    queryKey: ['team', id],
    queryFn: () => getTeam(id!),
  })
}

//get all matches
export function useGetAllMatches(eventId: string) {
  const {getAllMatches} = useApi();
  return useQuery({
    queryKey: ["matches", eventId],
    queryFn: () => getAllMatches(eventId),
    enabled: !!eventId,
  });
}

//get all schedules
export function useGetAllSchedules(eventId: string){
  const {getAllSchedules} = useApi();
  return useQuery({
    queryKey: ['schedules', eventId],
    queryFn: () => getAllSchedules(eventId),
    enabled: !!eventId,
  })
}

//get schedule by id
export function useGetSchedule(id: string, eventId: string){
  const {getSchedule} = useApi();
  return useQuery({
    queryKey:  ['schedule', id, eventId],
    queryFn:  () => getSchedule(id, eventId),
    enabled:  !!id && !!eventId,
  })
}

//get all attendances
export function useGetAllAttendances(eventId: string, scheduleId:string){
  const {getAllAttendances} = useApi();
  return useQuery({
    queryKey: ['attendances', eventId, scheduleId],
    queryFn: () => getAllAttendances(eventId, scheduleId),
    enabled:  !!eventId && !!scheduleId,

  })
}

//get all total match points
export function useGetMatchPoints(eventId: string) {
  const {getMatchPoints} = useApi();
  return useQuery({
    queryKey: ['match points', eventId],
    queryFn: () => getMatchPoints(eventId),
    enabled: !!eventId,
  })
}

//get all total  point include extrapoint
export function useGetAllTotalPoints(eventId: string){
  const {getAllTotalPoints} = useApi();
  return useQuery({
    queryKey: ['total point', eventId],
    queryFn: () => getAllTotalPoints(eventId)
    
  })
}

//get all point
export function useGetAllPoints(eventId: string){
  const {getAllPoints} = useApi();
  return useQuery({
    queryKey: ['points', eventId],
    queryFn: () => getAllPoints(eventId)
  })
}

//get all extra point
export function useGetAllExtraPoints(eventId: string){
  const {getAllExtraPoints} = useApi();
  return useQuery({
    queryKey: ['extrapoints', eventId],
    queryFn: () => getAllExtraPoints(eventId)
  })
}

//get notes
export function useGetAllNotes(eventId: string, matchId: string){
  const {getAllNotes} = useApi();
  return useQuery({
    queryKey: ['notes', eventId, matchId],
    queryFn: () => getAllNotes(eventId, matchId)
  })
}

//get round
export function useGetAllRound(eventId: string, matchId: string){
  const {getAllRounds} = useApi();
  return useQuery({
    queryKey: ['rounds', eventId, matchId],
    queryFn: () => getAllRounds(eventId, matchId)
  })
}

//get all sportPlayer
export function useGetAllSportPlayers(eventId: string, sportId: string) {
  const {getAllSportPlayers} = useApi();
  return useQuery({
    queryKey: ['sportplayers', eventId, sportId],
    queryFn: () => getAllSportPlayers(eventId, sportId),
    enabled:  !!eventId && !!sportId
  })
}

//get all team member
export function useGetAllTeamMembers(eventId : string, teamId: string){
  const {getAllTeamMembers} = useApi();
  return useQuery({
    queryKey: ['teamMembers', eventId, teamId],
    queryFn: () => getAllTeamMembers(eventId, teamId)
  })
}

//get profile
export function useGetProfile (userId: string){
  const {getProfile} = useApi();
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfile(userId)
  })
}

//get roles
export function useGetAllRoles (){
  const { getAllRoles } = useApi();
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => getAllRoles()
  })
}