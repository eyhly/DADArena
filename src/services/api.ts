import axios from "axios";
import { Event } from "../types/event";
import { Sport } from "../types/sport";
import { LoginUser } from "../types/login";
import { UserLogin } from "../types/user";
import { Team } from "../types/team";
import { Match } from "../types/match";
// import { useAuth0 } from "../auth0";
import { useAuth0 } from "@auth0/auth0-react";
import { SportPlayer } from "../types/sportPlayer";
import { TeamMember } from "../types/teamMember";
import { Point } from "../types/point";
import { Notes } from "../types/notes";
// import { Register } from "../types/register";
import { Round } from "../types/round";
import { Schedule } from "../types/schedule";
import { Attendance } from "../types/attendance";
import { ExtraPoint } from "../types/extraPoint";
import { useEffect, useState } from "react";
// import { useAuth0 } from '../pages/Auth/';

const BASE_URL = "http://localhost:5001/api";
// const BASE_URL = "http://192.168.0.104:5001/api";
// const BASE_URL = "http://192.168.53.149:5001/api";
// const axios = axios.create({ baseURL: BASE_URL });

const useApi = () => {
  const { handleRedirectCallback, getAccessTokenSilently, isAuthenticated } =
    useAuth0();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState(false);
  // const [isAuthenticated, setIs]
  useEffect(() => {
    const handleAuth0Redirect = async () => {
      if (window.location.search.includes("code=")) {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
          try {
            // ubah authorization code jadi tokens
            const response = await axios.post(
              "https://dev-wwlr6kvyhaa1e7bi.us.auth0.com/oauth/token",
              {
                client_id: "ClLkMpCvnDMhkOIkEoIXWtuc0iQT1uQ1",
                client_secret:
                  "J1APp7ZDupVL_Pb6_gjRx6uwadzDo-3kttcTc0B9Q1E4IQpei8e4T2CNxZoCnBxf",
                audience: "http://localhost:5001",
                grant_type: "password",
                // redirect_uri: "http://localhost:5173",
                // code
                username: "wiliperdanatestapp@gmail.com",
                password: "ASDasd00$",
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const { access_token } = response.data;
            console.log("access token", access_token);
            setAccessToken(access_token);
            //menyimpan access token
            localStorage.setItem('access_token', access_token);

            //mengganti code dengan pathname page
            const newUrl = window.location.origin + window.location.pathname;
            window.history.replaceState(null, '', newUrl);
          } catch (error) {
            console.error("Error during token exchange", error);
          }
        }
      }
    };

    handleAuth0Redirect();
  }, [handleRedirectCallback]);

  const getToken = async () => {
    if (isAuthenticated) {
      if (accessToken) {
        return accessToken;
      } else {
        const token = await getAccessTokenSilently();
        return token;
      }
    }
  };

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
    const getUserInfo = async () => {
      try {
        // const token = await getToken();
        const response = await axios.get<UserLogin>(`${BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
      }
    };

  //get all user
  //  const getAllUsers = () => {
  //   const response = await axios.get()
  // }

  //  get all events
  //  const getAllEvents = async () => {
  //   const response = await axios.get<Event[]>(`${BASE_URL}/events`, {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  //     },
  //   });
  //   return response.data;
  // };

  // // get event by ID
  //  const getEvent = async (id: string) => {
  //   const response = await axios.get<Event>(`${BASE_URL}/events/${id}`, {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  //     },
  //   });
  //   return response.data;
  // };

  //  get all events

  const getAllEvents = async (): Promise<Event[]> => {
    // const token = await getToken();
    const response = await axios.get<Event[]>(`${BASE_URL}/events`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return response.data;
  };
  // get event by ID
  const getEvent = async (id: string): Promise<Event> => {
    // const token = await getToken();
    try {
      const response = await axios.get<Event>(`${BASE_URL}/events/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching event with id ${id}:`, error);
      throw new Error("Failed to fetch event");
    }
  };

  //create event
  const createEvent = async (data: Event) => {
    // const token = await getToken();
    const response = await axios.post(`${BASE_URL}/events`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return response.data;
  };

  //update event
  const updateEvent = async (id: string, data: Event) => {
    // const token = await getToken();
    const response = await axios.put<Event>(`${BASE_URL}/events/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return response.data;
  };

  //delete event
  const deleteEvent = async (id: string) => {
    // const token = await getToken();
    const response = await axios.delete(`${BASE_URL}/events/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return response.data;
  };

  // //  get all sports
  //  const getAllSports = async () => {
  //   const response = await axios.get<Sport[]>(`${BASE_URL}/sports`, {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  //     },
  //   });
  //   return response.data;
  // };

  // // get sport by ID
  //  const getSport = async (id: string) => {
  //   const response = await axios.get<Sport>(`${BASE_URL}/sports/${id}`, {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  //     },
  //   });
  //   return response.data;
  // };

  //  get all sports
  const getAllSports = async (eventId: string): Promise<Sport[]> => {
    // const token = await getToken();

    try {
      const response = await axios.get<Sport[]>(
        `${BASE_URL}/events/${eventId}/sports`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      return response.data;
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching sport:", error);
      throw new Error("Failed to fetch sport");
    }
  };

  //create sport
  //get eventid
  //  const createSport = async (data: { title: string; eventId: string}, eventId: string)  => {
  //   const response = await axios.post<Sport[]>(`${BASE_URL}/events/${eventId}/sports`, data, {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  //     },
  //   });
  //   return response.data;
  // };

  const createSport = async (data: Omit<Sport, "id">) => {
    // const token = await getToken();
    const response = await axios.post<Sport>(
      `${BASE_URL}/events/${data.eventId}/sports`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  };

  //update sport
  //  const updateSport = async (id: string, data: Sport) => {
  //   const response = await axios.put<Sport>(`${BASE_URL}/sports/${id}`, data, {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  //     },
  //   });
  //   return response.data;
  // };

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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
    const response = await axios.get<Team[]>(
      `${BASE_URL}/events/${eventId}/teams`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  };
  //  get all teams
  //  const getAllTeams = async (eventTitle: string): Promise<Team[]> => {
  //   const eventId = getEventIdByTitle(eventTitle);
  //   const response = await axios.get<Team[]>(`${BASE_URL}/events/${eventId}/teams`, {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  //     },
  //   });
  //   return response.data;
  // };

  // get teams by ID
  const getTeam = async (id: string) => {
    // const token = await getToken();
    const response = await axios.get<Team>(`${BASE_URL}/teams/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  };

  // //get all match
  //  const getAllMatches = async (eventId: string, sportId: string): Promise<Match[]> => {
  //   try {
  //     const response = await axios.get<Match[]>(`${BASE_URL}/events/${eventId}/sports/${sportId}/matches`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching matches:", error);
  //     throw new Error("Failed to fetch matches");
  //   }
  // };
  //get all match
  const getAllMatches = async (eventId: string): Promise<Match[]> => {
    // const token = await getToken();

    try {
      const response = await axios.get<Match[]>(
        `${BASE_URL}/events/${eventId}/matches`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      return response.data;
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  };

  // API endpoint
  //  const updateMatch = async (id: string, eventId: string, data: { match: Match; rounds: Round[] }) => {
  //   const response = await axios.put(`${BASE_URL}/events/${eventId}/matches/${id}`, data, {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('access_token')}`
  //     }
  //   });
  //   return response.data;
  // };

  //delete match
  const deleteMatch = async (id: string, eventId: string) => {
    // const token = await getToken();
    const response = await axios.delete(
      `${BASE_URL}/events/${eventId}/matches/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  };

  //get all schedules
  const getAllSchedules = async (eventId: string) => {
    // const token = await getToken();
    const response = await axios.get(
      `${BASE_URL}/events/${eventId}/schedules`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  };

  //get schedule by id
  const getSchedule = async (id: string, eventId: string) => {
    // const token = await getToken();
    const response = await axios.get(
      `${BASE_URL}/events/${eventId}/schedules/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
    const response = await axios.get<Attendance[]>(
      `${BASE_URL}/events/${scheduleId}/schedules/${eventId}/attendances`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return response.data;
  };

  //create poin
  const createPoint = async (eventId: string, matchId: string, data: Point) => {
    // const token = await getToken();
    const response = await axios.post(
      `${BASE_URL}/events/${eventId}/matches/${matchId}/points`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  };

  //create notes
  const createNote = async (eventId: string, matchId: string, data: Notes) => {
    // const token = await getToken();
    const response = await axios.post(
      `${BASE_URL}/events/${eventId}/matches/${matchId}/notes`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  };

  //get total match point
  const getMatchPoints = async (eventId: string) => {
    // const token = await getToken();
    const response = await axios.get(
      `${BASE_URL}/events/${eventId}/matchPoints`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  };

  //get all sportPlayer
  const getAllSportPlayers = async (eventId: string, sportId: string) => {
    // const token = await getToken();
    const response = await axios.get(
      `${BASE_URL}/events/${eventId}/sports/${sportId}/sportPlayers`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  };

  //get sportPlayer by id

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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  };

  //delete sportPlayer
  const deleteSportPlayer = async (
    id: string,
    eventId: string,
    sportId: string
  ) => {
    // const token = await getToken();
    const response = await axios.delete(
      `${BASE_URL}/events/${eventId}/sports/${sportId}/sportPlayers/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  };

  //get all teamMember
  const getAllTeamMembers = async (eventId: string, teamId: string) => {
    // const token = await getToken();
    const response = await axios.get(
      `${BASE_URL}/events/${eventId}/teams/${teamId}/teamMembers`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  };

  return {
    getToken,
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
  };
};

export default useApi;
