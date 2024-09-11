import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Event } from "../types/event";
import { Sport } from "../types/sport";
import { LoginUser } from "../types/login";
import { Register } from "../types/register";
import { Rule } from "../types/rules";
import { Custom_Rule } from "../types/customRule";
import {
  postLogin,
  createEvent,
  updateEvent,
  deleteEvent,
  createSport,
  updateSport,
  deleteSport,
  postRegister,
  createRule,
  updateRule,
  deleteRule,
  updateCustomRule,
  createCustomRule,
  deleteCustomRule,
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
        throw new Error("Failed to login");
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
    mutationFn: ({ id, data }: { id: string; data: Sport & {eventId: string} }) =>
      updateSport(id, data),
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

//create rules
export function useCreateRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createRule"],
    mutationFn: (data: {
      minPlayer: number;
      maxPlayer: number;
      minWomen: number;
      sportId: string;
    }) => createRule(data),

    onError: () => {
      console.log("error");
    },

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["rule"] });
    },
  });
}

// update rule
export function useUpdateRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateRule"],
    mutationFn: ({ id, data }: { id: string; data: Rule }) =>
      updateRule(id, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["rule"] });
    },
  });
}

//delete rule
export function useDeleteRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteRule"],
    mutationFn: (id: string) => deleteRule(id),
    onError: () => {
      console.log("error");
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["rule"] });
    },
  });
}

//create custom rule
export function useCreateCustomRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createCustomRule"],
    mutationFn: (data: { description: string; sportId: string }) =>
      createCustomRule(data),
    onError: () => {
      console.log("error");
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["custom_rule"] });
    },
  });
}

//update custom rule
export function useUpdateCustomRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateCustomRule"],
    mutationFn: ({ id, data }: { id: string; data: Custom_Rule }) =>
      updateCustomRule(id, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["custom_rule"] });
    },
  });
}

//delete custom rule
export function useDeleteCustomRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteCustomRule"],
    mutationFn: (id: string) => deleteCustomRule(id),
    onError: () => {
      console.log("error");
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["custom_rule"] });
    },
  });
}

//create team
export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createTeam"],
    mutationFn: (data: Team) => createTeam(data),
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
    mutationFn: ({ id, data }: { id: string; data: Team }) =>
      updateTeam(id, data),
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
    mutationFn: (id: string) => deleteTeam(id),

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
    mutationFn: (data: Match) => createMatch(data),
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
    mutationFn: ({id, data}:{id: string, data: Match}) => updateMatch(id, data), 
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
    mutationFn: (id: string) => deleteMatch(id),
    onError: () => {
      console.log("error")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['match']})
    }
  })
}