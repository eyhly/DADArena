import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Event } from "../types/event";
import { Sport } from "../types/sport";
import { LoginUser } from "../types/login";
// import { Register } from "../types/register";
import useApi from "./api";
import { Team } from "../types/team";
import { Match } from "../types/match";
import { SportPlayer } from "../types/sportPlayer";
import { TeamMember } from "../types/teamMember";
import { Point } from "../types/point";
import { Notes } from "../types/notes";
import { Round } from "../types/round";
import { Schedule } from "../types/schedule";
import { ExtraPoint } from "../types/extraPoint";
import { Attendance } from "../types/attendance";
import { Profile } from "../types/profile";
import { Roles } from "../types/user";

// login
export function useLogin() {
  const queryClient = useQueryClient();
  const { postLogin } = useApi();
  return useMutation<LoginUser, Error, LoginUser, unknown>({
    mutationFn: async (data: LoginUser) => {
      try {
        const result = await postLogin(data);
        return result;
      } catch (error) {
        console.error("Error to login:", error);
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
  const { createEvent } = useApi();
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
  const { updateEvent } = useApi();
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
  const { deleteEvent } = useApi();

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
  const { createSport } = useApi();
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
  const { updateSport } = useApi();
  return useMutation({
    mutationKey: ["updateSport"],
    mutationFn: ({
      id,
      eventId,
      data,
    }: {
      id: string;
      eventId: string;
      data: Sport & { eventId: string };
    }) => updateSport(id, eventId, data),
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
  const { deleteSport } = useApi();

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
  const { createTeam } = useApi();

  return useMutation({
    mutationKey: ["createTeam"],
    mutationFn: ({ eventId, data }: { eventId: string; data: Team }) =>
      createTeam(eventId, data),
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
  const { updateTeam } = useApi();

  return useMutation({
    mutationKey: ["updateTeam"],
    mutationFn: ({
      id,
      data,
      eventId,
    }: {
      id: string;
      eventId: string;
      data: Team;
    }) => updateTeam(id, eventId, data),
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
  const { deleteTeam } = useApi();

  return useMutation({
    mutationKey: ["delete team"],
    mutationFn: ({ id, eventId }: { id: string; eventId: string }) =>
      deleteTeam(id, eventId),

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
  const { createMatch } = useApi();

  return useMutation({
    mutationKey: ["create match"],
    mutationFn: ({ eventId, data }: { eventId: string; data: Match }) =>
      createMatch(eventId, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["match"] });
    },
  });
}

//update match
export function useUpdateMatch() {
  const queryClient = useQueryClient();
  const { updateMatch } = useApi();

  return useMutation({
    mutationKey: ["update match"],
    mutationFn: ({
      id,
      data,
      eventId,
    }: {
      id: string;
      eventId: string;
      data: Match;
    }) => updateMatch(id, eventId, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["match"] });
    },
  });
}

//delete match
export function useDeleteMatch() {
  const queryClient = useQueryClient();
  const { deleteMatch } = useApi();

  return useMutation({
    mutationKey: ["delete match"],
    mutationFn: ({ id, eventId }: { id: string; eventId: string }) =>
      deleteMatch(id, eventId),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["match"] });
    },
  });
}

//create schedule
export function useCreateSchedule() {
  const queryClient = useQueryClient();
  const { createSchedule } = useApi();
  return useMutation({
    mutationKey: ["create schedule"],
    mutationFn: ({ eventId, data }: { eventId: string; data: Schedule }) =>
      createSchedule(eventId, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
  });
}

//update schedule
export function useUpdateSchedule() {
  const queryClient = useQueryClient();
  const { updateSchedule } = useApi();

  return useMutation({
    mutationKey: ["update schedule"],
    mutationFn: ({
      id,
      eventId,
      data,
    }: {
      id: string;
      eventId: string;
      data: Schedule;
    }) => updateSchedule(id, eventId, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
  });
}

//delete schedule
export function useDeleteSchedule() {
  const queryClient = useQueryClient();
  const { deleteSchedule } = useApi();

  return useMutation({
    mutationKey: ["delete schedule"],
    mutationFn: ({ id, eventId }: { id: string; eventId: string }) =>
      deleteSchedule(id, eventId),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
  });
}

//create attendance
export function useCreateAttendance() {
  const queryClient = useQueryClient();
  const { createAttendance } = useApi();

  return useMutation({
    mutationKey: ["create attendance"],
    mutationFn: ({
      eventId,
      scheduleId,
      data,
    }: {
      eventId: string;
      scheduleId: string;
      data: Attendance;
    }) => createAttendance(eventId, scheduleId, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

//update attendance
export function useUpdateAttendance() {
  const { updateAttendance } = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update attendance"],
    mutationFn: ({
      id,
      eventId,
      scheduleId,
      data,
    }: {
      id: string;
      eventId: string;
      scheduleId: string;
      data: Attendance;
    }) => updateAttendance(id, eventId, scheduleId, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

//delete attendance
export function useDeleteAttendance() {
  const queryClient = useQueryClient();
  const { deleteAttendance } = useApi();

  return useMutation({
    mutationKey: ["delete attendace"],
    mutationFn: ({
      id,
      eventId,
      scheduleId,
    }: {
      id: string;
      eventId: string;
      scheduleId: string;
    }) => deleteAttendance(id, eventId, scheduleId),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

//create point
export function useCreatePoint() {
  const queryClient = useQueryClient();
  const { createPoint } = useApi();

  return useMutation({
    mutationKey: ["create point"],
    mutationFn: ({
      eventId,
      matchId,
      data,
    }: {
      eventId: string;
      matchId: string;
      data: Point;
    }) => createPoint(eventId, matchId, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["point"] });
    },
  });
}

//update point
export function useUpdatePoint() {
  const queryClient = useQueryClient();
  const { updatePoint } = useApi();
  return useMutation({
    mutationKey: ["update point"],
    mutationFn: ({
      id,
      eventId,
      matchId,
      data,
    }: {
      id: string;
      eventId: string;
      matchId: string;
      data: Point;
    }) => updatePoint(id, eventId, matchId, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["point"] });
    },
  });
}

//delete point
export function useDeletePoint() {
  const queryClient = useQueryClient();
  const { deletePoint } = useApi();
  return useMutation({
    mutationKey: ["delete point"],
    mutationFn: ({
      id,
      eventId,
      matchId,
    }: {
      id: string;
      eventId: string;
      matchId: string;
    }) => deletePoint(id, eventId, matchId),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["point"] });
    },
  });
}

//create extrapoint
export function useCreateExtraPoint() {
  const queryClient = useQueryClient();
  const { createExtraPoint } = useApi();

  return useMutation({
    mutationKey: ["create extrapoint"],
    mutationFn: ({
      eventId,
      teamId,
      data,
    }: {
      eventId: string;
      teamId: string;
      data: ExtraPoint;
    }) => createExtraPoint(eventId, teamId, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extrapoint"] });
    },
  });
}

//update extrapoint
export function useUpdateExtraPoint() {
  const queryClient = useQueryClient();
  const { updateExtraPoint } = useApi();
  return useMutation({
    mutationKey: ["update extrapoint"],
    mutationFn: ({
      id,
      eventId,
      teamId,
      data,
    }: {
      id: string;
      eventId: string;
      teamId: string;
      data: ExtraPoint;
    }) => updateExtraPoint(id, eventId, teamId, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extrapoint"] });
    },
  });
}

//delete extrapoint
export function useDeleteExtraPoint() {
  const queryClient = useQueryClient();
  const { deleteExtraPoint } = useApi();
  return useMutation({
    mutationKey: ["delete extrapoint"],
    mutationFn: ({
      id,
      eventId,
      teamId,
    }: {
      id: string;
      eventId: string;
      teamId: string;
    }) => deleteExtraPoint(id, eventId, teamId),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extrapoint"] });
    },
  });
}

//create note
export function useCreateNote() {
  const queryClient = useQueryClient();
  const { createNote } = useApi();

  return useMutation({
    mutationKey: ["create note"],
    mutationFn: ({
      eventId,
      matchId,
      data,
    }: {
      eventId: string;
      matchId: string;
      data: Notes;
    }) => createNote(eventId, matchId, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note"] });
    },
  });
}

//update note
export function useUpdateNote() {
  const queryClient = useQueryClient();
  const { updateNote } = useApi();

  return useMutation({
    mutationKey: ["update note"],
    mutationFn: ({
      id,
      eventId,
      matchId,
      data,
    }: {
      id: string;
      eventId: string;
      matchId: string;
      data: Notes;
    }) => updateNote(id, eventId, matchId, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note"] });
    },
  });
}

//delete note
export function useDeleteNote() {
  const queryClient = useQueryClient();
  const { deleteNote } = useApi();

  return useMutation({
    mutationKey: ["delete note"],
    mutationFn: ({
      id,
      eventId,
      matchId,
    }: {
      id: string;
      eventId: string;
      matchId: string;
    }) => deleteNote(id, eventId, matchId),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note"] });
    },
  });
}

//create round
export function useCreateRound() {
  const queryClient = useQueryClient();
  const { createRound } = useApi();

  return useMutation({
    mutationKey: ["create round"],
    mutationFn: ({
      eventId,
      matchId,
      data,
    }: {
      eventId: string;
      matchId: string;
      data: Round;
    }) => createRound(eventId, matchId, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["round"] });
    },
  });
}

//update round
export function useUpdateRound() {
  const queryClient = useQueryClient();
  const { updateRound } = useApi();

  return useMutation({
    mutationKey: ["update round"],
    mutationFn: ({
      id,
      eventId,
      matchId,
      data,
    }: {
      id: string;
      eventId: string;
      matchId: string;
      data: Round;
    }) => updateRound(id, eventId, matchId, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["round"] });
    },
  });
}

//delete round
export function useDeleteRound() {
  const queryClient = useQueryClient();
  const { deleteRound } = useApi();
  return useMutation({
    mutationKey: ["delete round"],
    mutationFn: ({
      id,
      eventId,
      matchId,
    }: {
      id: string;
      eventId: string;
      matchId: string;
    }) => deleteRound(id, eventId, matchId),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["round"] });
    },
  });
}

//create Sport Player
export function useCreateSportPlayer() {
  const queryClient = useQueryClient();
  const { createSportPlayer } = useApi();

  return useMutation({
    mutationKey: ["create sport player"],
    mutationFn: ({
      eventId,
      sportId,
      data,
    }: {
      eventId: string;
      sportId: string;
      data: SportPlayer;
    }) => createSportPlayer(eventId, sportId, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sportplayer"] });
    },
  });
}

//update sport player
export function useUpdateSportPlayer() {
  const queryClient = useQueryClient();
  const { updateSportPlayer } = useApi();

  return useMutation({
    mutationKey: ["update sport player"],
    mutationFn: ({
      id,
      eventId,
      sportId,
      data,
    }: {
      id: string;
      eventId: string;
      sportId: string;
      data: SportPlayer;
    }) => updateSportPlayer(id, eventId, sportId, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sportplayer"] });
    },
  });
}

//delete sport player
export function useDeleteSportPlayer() {
  const queryClient = useQueryClient();
  const { deleteSportPlayer } = useApi();

  return useMutation({
    mutationKey: ["delete sport player"],
    mutationFn: ({
      id,
      eventId,
      sportId,
    }: {
      id: string;
      eventId: string;
      sportId: string;
    }) => deleteSportPlayer(id, eventId, sportId),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sportplayer"] });
    },
  });
}

//create team member
export function useCreateTeamMember() {
  const queryClient = useQueryClient();
  const { createTeamMember } = useApi();

  return useMutation({
    mutationKey: ["create team member"],
    mutationFn: ({
      eventId,
      teamId,
      data,
    }: {
      eventId: string;
      teamId: string;
      data: TeamMember;
    }) => createTeamMember(eventId, teamId, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teammember"] });
    },
  });
}

//update team member
export function useUpdateTeamMember() {
  const queryClient = useQueryClient();
  const { updateTeamMember } = useApi();

  return useMutation({
    mutationKey: ["update team member"],
    mutationFn: ({
      id,
      eventId,
      teamId,
      data,
    }: {
      id: string;
      eventId: string;
      teamId: string;
      data: TeamMember;
    }) => updateTeamMember(id, eventId, teamId, data),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teammember"] });
    },
  });
}

//delete team member
export function useDeleteTeamMember() {
  const queryClient = useQueryClient();
  const { deleteTeamMember } = useApi();

  return useMutation({
    mutationKey: ["delete team member"],
    mutationFn: ({
      userId,
      eventId,
      teamId,
    }: {
      userId: string;
      eventId: string;
      teamId: string;
    }) => deleteTeamMember(userId, eventId, teamId),
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teammember"] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const {updateProfile} = useApi();
  return useMutation({
    mutationKey: ['update profile'],
    mutationFn: ({userId, data} : {userId: string; data: Profile}) => updateProfile(userId, data),
    onError: () => {
      console.log("error")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  })
}

export function useCreateRoles() {
  const {createRoles} = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create roles'],
    mutationFn: ({userId, data}: {userId: string; data: Roles}) => createRoles(userId, data),
    onError: () => {
      console.log('error');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['role']})
    }
  })
}

export function useDeleteRoles() {
  const {deleteRoles} = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['delete roles'],
    mutationFn: ({userId, data}: {userId: string; data: {roles : string[]}}) => deleteRoles({userId, data}),
    onError: () => {
       console.log('error');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['roles']})
    }
  })
}