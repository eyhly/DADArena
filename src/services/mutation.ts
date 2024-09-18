import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Event } from "../types/event";
import { Sport } from "../types/sport";
import { LoginUser } from "../types/login";
import { Register } from "../types/register";
import {
  postLogin,
  createEvent,
  updateEvent,
  deleteEvent,
  createSport,
  updateSport,
  deleteSport,
  postRegister,
  createTeam,
  updateTeam,
  deleteTeam,
  createMatch,
  updateMatch,
  deleteMatch,
} from "./api";
import { Team } from "../types/team";
import { Match } from "../types/match";

//register
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<Register, Error, Register, unknown>({
    mutationFn: async (data: Register) => {
      try {
        const result = await postRegister(data);
        return result;
      } catch (error) {
        console.error("Error to login:", error);
        throw new Error("Failed to register");
      }
    },

    onError: () => {
      console.log("error");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["register"] });
    },
  });
}

//login
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<LoginUser, Error, LoginUser, unknown>({
    mutationFn: async (data: LoginUser) => {
      try {
        const result = await postLogin(data);
        return result;
      } catch (error) {
        console.error("Error to login:", error);
        throw new Error("Failed to login",);
      }
    },

    onError: () => {
      console.log("error");
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["login"] });
    },
  });
}

//create event
export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createEvent"],
    mutationFn: (data: Event) => createEvent(data),

    onError: () => {
      console.log("error");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["event"] });
    },
  });
}

//update event
export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateEvent"],
    mutationFn: ({ id, data }: { id: string; data: Event }) =>
      updateEvent(id, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["event"] });
    },
  });
}

//delete event
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteEvent"],
    mutationFn: (id: string) => deleteEvent(id),

    onError: () => {
      console.log("error");
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["event"] });
    },
  });
}

//create sport
export function useCreateSport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createSport"],
    mutationFn: (data: {
      title: string;
      minPlayer: number;
      maxPlayer: number;
      minWomen: number;
      minMen: number;
      description: string;
      eventId: string;  
    }) => createSport(data),

    onError: () => {
      console.log("error");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["sport"] });
    },
  });
}

//update sport
export function useUpdateSport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateSport"],
    mutationFn: ({ id, eventId, data }: { id: string; eventId: string; data: Sport & {eventId: string} }) =>
      updateSport(id, eventId, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["sport"] });
    },
  });
}

//delete sport
export function useDeleteSport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteSport"],
    mutationFn: ({ id, eventId }: { id: string; eventId: string }) => 
      deleteSport(id, eventId),

    onError: () => {
      console.log("error");
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["sport"] });
    },
  });
}


//create team
export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createTeam"],
    mutationFn: ({eventId, data}:{eventId: string, data: Team}) => createTeam(eventId, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });
}

//update team
export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateTeam"],
    mutationFn: ({ id, data, eventId }: { id: string; eventId: string; data: Team }) =>
      updateTeam(id, eventId, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });
}

// delete team
export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete team"],
    mutationFn: ({id, eventId}:{ id: string, eventId: string}) => deleteTeam(id, eventId),

    onError: () => {
      console.log("error");
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });
}

//create match 
export function useCreateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['create match'],
    mutationFn: ({eventId, data }:{eventId: string, data: Match}) => createMatch(eventId, data),
    onError: () => {
      console.log('error')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['match']})
    }
  })
}

//update match 
export function useUpdateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update match'],
    mutationFn: ({id, data, eventId}:{id: string, eventId: string, data: Match}) => updateMatch(id, eventId, data), 
    onError: () => {
      console.log('error')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['match']})
    }
  })
}

//delete match
export function useDeleteMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete match'],
    mutationFn: ({id, eventId}:{id: string, eventId: string}) => deleteMatch(id, eventId),
    onError: () => {
      console.log("error")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['match']})
    }
  })
}