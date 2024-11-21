import axios from "axios";
import { Event, EventResponse, Pagination } from "../types/event";
import { Sport, SportResponse } from "../types/sport";
import { LoginUser } from "../types/login";
import { Roles, UserLogin, UserResponse } from "../types/user";
import { Team, TeamResponse } from "../types/team";
import { Match, MatchResponse } from "../types/match";
import { SportPlayer } from "../types/sportPlayer";
import { TeamMember, TeamMemberResponse } from "../types/teamMember";
import { Point } from "../types/point";
import { Notes } from "../types/notes";
import { Round } from "../types/round";
import { Schedule, ScheduleResponse } from "../types/schedule";
import { Attendance, AttendanceResponse } from "../types/attendance";
import { ExtraPoint } from "../types/extraPoint";
import { useEffect, useState } from "react";
import { useAuthState } from "../hook/useAuth";
import { Profile } from "../types/profile";

const BASE_URL = "http://api-dadsportleague.my.id:5001/api";
// const BASE_URL = "http://192.168.53.3:5001/api";
// const axios = axios.create({ baseURL: BASE_URL });

const useApi = () => {
  const {data: authState} = useAuthState();
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('access_token'))

  useEffect(() => {
    const handleAuthToken = () => {
      if (authState?.isAuthenticated && authState.user?.access_token) {
        const token =  authState?.user?.access_token;
        if (token) {
          setAccessToken(token)
          localStorage.setItem('access_token', token)
          
          //untuk mwnghilangkan code di url
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }
    handleAuthToken();
  }, [authState])

  // //register
  //  const postRegister = async (data: Register) => {
  //   const response = await axios.post<Register>(
  //     `${BASE_URL}/account/register`,
  //     data
  //   );
  //   return response.data;
  // };

  //login
  const postLogin = async (data: LoginUser) => {
    const response = await axios.post<LoginUser>(`${BASE_URL}/login`, data);
    return response.data;
  };

  //get user info
    const getUserInfo = async (pageNumber: number, pageSize: number): Promise<UserResponse> => {
      try {
        // const token = await getToken();
        const response = await axios.get<{data: UserLogin[]; pagination: Pagination}>(`${BASE_URL}/users/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            pageNumber,
            pageSize
          }
        });
        return {
          data: response.data.data,
          pagination: response.data.pagination
        };
      } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
      }
    };

  //  get all events

  const getAllEvents = async (): Promise<Event[]> => {
    // const token = await getToken();
    const response = await axios.get<EventResponse>(`${BASE_URL}/events`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  };
  // get event by ID
  const getEvent = async (id: string): Promise<Event> => {
    // const token = await getToken();
    try {
      const response = await axios.get<Event>(`${BASE_URL}/events/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching event with id ${id}:`, error);
      throw new Error("Failed to fetch event");
    }
  };

  //create event
  const createEvent = async (data: FormData) => {
    // const token = await getToken();
    const response = await axios.post(`${BASE_URL}/events`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };

  //update event
  const updateEvent = async (id: string, data: Event) => {
    // const token = await getToken();
    const response = await axios.put<Event>(`${BASE_URL}/events/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };

  //delete event
  const deleteEvent = async (id: string) => {
    // const token = await getToken();
    const response = await axios.delete(`${BASE_URL}/events/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };

  //  get all sports
  const getAllSports = async (eventId: string): Promise<Sport[]> => {
    // const token = await getToken();

    try {
      const response = await axios.get<SportResponse>(
        `${BASE_URL}/events/${eventId}/sports`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching sports:", error);
      throw new Error("Failed to fetch sports");
    }
  };

  // get sport by ID
  const getSport = async (id: string): Promise<Sport> => {
    // const token = await getToken();

    try {
      const response = await axios.get<Sport>(`${BASE_URL}/sports/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching sport:", error);
      throw new Error("Failed to fetch sport");
    }
  };

  const createSport = async (data: Omit<Sport, "id">) => {
    // const token = await getToken();
    const response = await axios.post<Sport>(
      `${BASE_URL}/events/${data.eventId}/sports`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  const updateSport = async (
    id: string,
    eventId: string,
    data: Omit<Sport, "id" | "eventId">
  ): Promise<Sport[]> => {
    // const token = await getToken();
    const response = await axios.put<Sport[]>(
      `${BASE_URL}/events/${eventId}/sports/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //delete sport
  const deleteSport = async (id: string, eventId: string) => {
    // const token = await getToken();
    const response = await axios.delete(
      `${BASE_URL}/events/${eventId}/sports/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          eventId: eventId,
        },
      }
    );
    return response.data;
  };

  //  get all teams
  const getAllTeams = async (eventId: string): Promise<Team[]> => {
    // const token = await getToken();
    const response = await axios.get<TeamResponse>(
      `${BASE_URL}/events/${eventId}/teams`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  };

  // get teams by ID
  const getTeam = async (id: string) => {
    // const token = await getToken();
    const response = await axios.get<Team>(`${BASE_URL}/teams/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };

  //create teams
  const createTeam = async (eventId: string, data: Team) => {
    // const token = await getToken();
    const response = await axios.post(
      `${BASE_URL}/events/${eventId}/teams`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //update teams
  const updateTeam = async (id: string, eventId: string, data: Team) => {
    // const token = await getToken();
    const response = await axios.put<Team>(
      `${BASE_URL}/events/${eventId}/teams/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //delete teams
  const deleteTeam = async (id: string, eventId: string) => {
    // const token = await getToken();
    const response = await axios.delete(
      `${BASE_URL}/events/${eventId}/teams/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //get all match
  const getAllMatches = async (eventId: string): Promise<Match[]> => {
    // const token = await getToken();

    try {
      const response = await axios.get<MatchResponse>(
        `${BASE_URL}/events/${eventId}/matches`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching matches:", error);
      throw new Error("Failed to fetch matches");
    }
  };

  //get match by id
  const getMatch = async (id: string): Promise<Match> => {
    // const token = await getToken();

    try {
      const response = await axios.get<Match>(`${BASE_URL}/matches/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching match:", error);
      throw new Error("Failed to fetch match");
    }
  };

  //create match
  const createMatch = async (eventId: string, data: Match) => {
    // const token = await getToken();
    const response = await axios.post(
      `${BASE_URL}/events/${eventId}/matches`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  // //update match
  const updateMatch = async (id: string, eventId: string, data: Match) => {
    // const token = await getToken();
    const response = await axios.put<Match>(
      `${BASE_URL}/events/${eventId}/matches/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //delete match
  const deleteMatch = async (id: string, eventId: string) => {
    // const token = await getToken();
    const response = await axios.delete(
      `${BASE_URL}/events/${eventId}/matches/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //get all schedules
  const getAllSchedules = async (eventId: string) : Promise<Schedule[]> => {
    // const token = await getToken();
    const response = await axios.get<ScheduleResponse>(
      `${BASE_URL}/events/${eventId}/schedules`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  };

  //get schedule by id
  const getSchedule = async (id: string, eventId: string) => {
    // const token = await getToken();
    const response = await axios.get(
      `${BASE_URL}/events/${eventId}/schedules/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //create schedules
  const createSchedule = async (eventId: string, data: Schedule) => {
    // const token = await getToken();
    const response = await axios.post(
      `${BASE_URL}/events/${eventId}/schedules`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //update schedule
  const updateSchedule = async (
    id: string,
    eventId: string,
    data: Schedule
  ) => {
    // const token = await getToken();
    const response = await axios.put(
      `${BASE_URL}/events/${eventId}/schedules/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //delete schedule
  const deleteSchedule = async (id: string, eventId: string) => {
    // const token = await getToken();
    const response = await axios.delete(
      `${BASE_URL}/events/${eventId}/schedules/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //get all attendances
  const getAllAttendances = async (
    eventId: string,
    scheduleId: string
  ): Promise<Attendance[]> => {
    // const token = await getToken();
    const response = await axios.get<AttendanceResponse>(
      `${BASE_URL}/events/${scheduleId}/schedules/${eventId}/attendances`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  };

  //create attendance
  const createAttendance = async (
    eventId: string,
    scheduleId: string,
    data: Attendance
  ) => {
    // const token = await getToken();
    const response = await axios.post(
      `${BASE_URL}/events/${eventId}/schedules/${scheduleId}/attendances`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //update attendance
  const updateAttendance = async (
    id: string,
    eventId: string,
    scheduleId: string,
    data: Attendance
  ) => {
    // const token = await getToken();
    const response = await axios.put(
      `${BASE_URL}/events/${eventId}/schedules/${scheduleId}/attendances/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //delete attendance
  const deleteAttendance = async (
    id: string,
    eventId: string,
    scheduleId: string
  ) => {
    // const token = await getToken();
    const response = await axios.delete(
      `${BASE_URL}/events/${eventId}/schedules/${scheduleId}/attendances/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //get all rounds
  const getAllRounds = async (eventId: string, matchId: string) => {
    // const token = await getToken();
    const response = await axios.get(
      `${BASE_URL}/events/${eventId}/matches/${matchId}/rounds`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //create rounds
  const createRound = async (eventId: string, matchId: string, data: Round) => {
    // const token = await getToken();
    const response = await axios.post(
      `${BASE_URL}/events/${eventId}/matches/${matchId}/rounds`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //update round
  const updateRound = async (
    id: string,
    eventId: string,
    matchId: string,
    data: Round
  ) => {
    // const token = await getToken();
    const response = await axios.put(
      `${BASE_URL}/events/${eventId}/matches/${matchId}/rounds/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //delete round
  const deleteRound = async (id: string, eventId: string, matchId: string) => {
    // const token = await getToken();
    const response = await axios.delete(
      `${BASE_URL}/events/${eventId}/matches/${matchId}/rounds/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //get all poin
  const getAllPoints = async (eventId: string) => {
    // const token = await getToken();
    const response = await axios.get(`${BASE_URL}/events/${eventId}/points`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  };

  //create poin
  const createPoint = async (eventId: string, matchId: string, data: Point) => {
    // const token = await getToken();
    const response = await axios.post(
      `${BASE_URL}/events/${eventId}/matches/${matchId}/points`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //update poin
  const updatePoint = async (
    id: string,
    eventId: string,
    matchId: string,
    data: Point
  ) => {
    // const token = await getToken();
    const response = await axios.put(
      `${BASE_URL}/events/${eventId}/matches/${matchId}/points/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //delete point
  const deletePoint = async (id: string, eventId: string, matchId: string) => {
    // const token = await getToken();
    const response = await axios.delete(
      `${BASE_URL}/events/${eventId}/matches/${matchId}/points/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //get all extra point
  const getAllExtraPoints = async (eventId: string) => {
    // const token = await getToken();
    const response = await axios.get(
      `${BASE_URL}/events/${eventId}/extrapoints`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  };

  //create extrapoint
  const createExtraPoint = async (
    eventId: string,
    teamId: string,
    data: ExtraPoint
  ) => {
    // const token = await getToken();
    const response = await axios.post(
      `${BASE_URL}/events/${eventId}/teams/${teamId}/extrapoints`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //update  extrapoint
  const updateExtraPoint = async (
    id: string,
    eventId: string,
    teamId: string,
    data: ExtraPoint
  ) => {
    // const token = await getToken();
    const response = await axios.put(
      `${BASE_URL}/events/${eventId}/teams/${teamId}/extrapoints/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //delete extra point
  const deleteExtraPoint = async (
    id: string,
    eventId: string,
    teamId: string
  ) => {
    // const token = await getToken();
    const response = await axios.delete(
      `${BASE_URL}/events/${eventId}/teams/${teamId}/extrapoints/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //get all notes
  const getAllNotes = async (eventId: string, matchId: string) => {
    // const token = await getToken();
    const response = await axios.get(
      `${BASE_URL}/events/${eventId}/matches/${matchId}/notes`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  };

  //create notes
  const createNote = async (eventId: string, matchId: string, data: Notes) => {
    // const token = await getToken();
    const response = await axios.post(
      `${BASE_URL}/events/${eventId}/matches/${matchId}/notes`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //update notes
  const updateNote = async (
    id: string,
    eventId: string,
    matchId: string,
    data: Notes
  ) => {
    // const token = await getToken();
    const response = await axios.put(
      `${BASE_URL}/events/${eventId}/matches/${matchId}/notes/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //delete notes
  const deleteNote = async (id: string, eventId: string, matchId: string) => {
    // const token = await getToken();
    const response = await axios.delete(
      `${BASE_URL}/events/${eventId}/matches/${matchId}/notes/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //get all total point include extrapoint
  const getAllTotalPoints = async (eventId: string) => {
    // const token = await getToken();
    const response = await axios.get(
      `${BASE_URL}/events/${eventId}/totalpoints`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //export recap point
  const exportRecapPoint = async (eventId: string) => {
    const response = await axios.get(
      `${BASE_URL}/events/${eventId}/totalpoints/export`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: 'blob'
      }
    );
    //mmebuat url untuk mengunduh datanya
    const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Recap-Poin.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode!.removeChild(link);
    return response.data;
  }


  //get total match point
  const getMatchPoints = async (eventId: string) => {
    // const token = await getToken();
    const response = await axios.get(
      `${BASE_URL}/events/${eventId}/matchPoints`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  };

  //get all sportPlayer
  const getAllSportPlayers = async (eventId: string, sportId: string) => {
    // const token = await getToken();
    const response = await axios.get(
      `${BASE_URL}/events/${eventId}/sports/${sportId}/sportPlayers`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  };

  //create sportPlayer
  const createSportPlayer = async (
    eventId: string,
    sportId: string,
    data: SportPlayer
  ) => {
    // const token = await getToken();
    const response = await axios.post(
      `${BASE_URL}/events/${eventId}/sports/${sportId}/sportPlayers`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //update sportPlayer
  const updateSportPlayer = async (
    id: string,
    eventId: string,
    sportId: string,
    data: SportPlayer
  ) => {
    // const token = await getToken();
    const response = await axios.put(
      `${BASE_URL}/events/${eventId}/sports/${sportId}/sportPlayers/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //delete sportPlayer
  const deleteSportPlayer = async (
    id: string,
    eventId: string,
    sportId: string,
  ) => {
    // const token = await getToken();
    const response = await axios.delete(
      `${BASE_URL}/events/${eventId}/sports/${sportId}/sportPlayers/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //get all teamMember
  const getAllTeamMembers = async (eventId: string, teamId: string): Promise<TeamMember[]> => {
    // const token = await getToken();
    const response = await axios.get<TeamMemberResponse>(
      `${BASE_URL}/events/${eventId}/teams/${teamId}/teamMembers`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  };

  //create teamMember
  const createTeamMember = async (
    eventId: string,
    teamId: string,
    data: TeamMember
  ) => {
    // const token = await getToken();
    const response = await axios.post(
      `${BASE_URL}/events/${eventId}/teams/${teamId}/teamMembers`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //updateteamMember
  const updateTeamMember = async (
    id: string,
    eventId: string,
    teamId: string,
    data: TeamMember
  ) => {
    // const token = await getToken();

    const response = await axios.put(
      `${BASE_URL}/events/${eventId}/teams/${teamId}/teamMember/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //deleteTeamMember
  const deleteTeamMember = async (
    userId: string,
    eventId: string,
    teamId: string
  ) => {
    // const token = await getToken();
    const response = await axios.delete(
      `${BASE_URL}/events/${eventId}/teams/${teamId}/teamMembers/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  //get profile
  const getProfile = async (userId: string) => {
    const response = await axios.get(`${BASE_URL}/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data;
  }

  //update profile
  const updateProfile = async (userId: string, data: Profile) => {
    const response = await axios.patch(`${BASE_URL}/profile/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    return response.data;
  }

  //export team member
  const exportTeamMembers = async (eventId: string, teamId: string) => {
    // const token = await getToken();
    const response = await axios.get(
      `${BASE_URL}/events/${eventId}/teams/${teamId}/teamMembers/export`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: 'blob'
      }
    );
    //mmebuat url untuk mengunduh datanya
    const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${teamId} Members.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode!.removeChild(link);
    return response.data;
  };

  //export sportPlayer
  const exportSportPlayers = async (eventId: string, sportId: string) => {
    // const token = await getToken();
    const response = await axios.get(
      `${BASE_URL}/events/${eventId}/sports/${sportId}/sportplayers/export`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: 'blob'
      }
    );
    //mmebuat url untuk mengunduh datanya
    const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${sportId} Players.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode!.removeChild(link);
    return response.data;
  };

  const getAllRoles = async () => {
    const response = await axios.get(`${BASE_URL}/roles`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data;
  }

  const createRoles = async (userId: string, data: Roles) => {
    const response = await axios.post(`${BASE_URL}/users/${userId}/roles`, data, {
      headers : {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data;
  }

  const deleteRoles = async ({userId, data} : {userId: string, data: {roles: string[]}}) => {
    const response = await axios.delete(`${BASE_URL}/users/${userId}/roles`, {
      data:{roles: data.roles},
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    return response.data;
  }

  return {
    getAllEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    getAllSports,
    getSport,
    createSport,
    updateSport,
    deleteSport,
    getAllTeams,
    getTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    getAllMatches,
    getMatch,
    createMatch,
    updateMatch,
    deleteMatch,
    getAllTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    getAllSchedules,
    getSchedule,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getAllAttendances,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    getAllRounds,
    createRound,
    updateRound,
    deleteRound,
    getAllNotes,
    createNote,
    updateNote,
    deleteNote,
    getAllTotalPoints,
    getMatchPoints,
    getAllExtraPoints,
    createExtraPoint,
    updateExtraPoint,
    deleteExtraPoint,
    getAllPoints,
    createPoint,
    updatePoint,
    deletePoint,
    getAllSportPlayers,
    createSportPlayer,
    updateSportPlayer,
    deleteSportPlayer,
    postLogin,
    getUserInfo,
    getProfile,
    updateProfile,
    exportTeamMembers,
    exportSportPlayers,
    getAllRoles,
    createRoles,
    deleteRoles,
    exportRecapPoint,
  };
};

export default useApi;
