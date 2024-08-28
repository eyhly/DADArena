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
} from "./api";

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
    mutationFn: (data: Sport) => createSport(data),

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
    mutationFn: ({ id, data }: { id: string; data: Sport }) =>
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
    mutationFn: (id: string) => deleteSport(id),

    onError: () => {
      console.log("error");
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["sport"] });
    },
  });
}
