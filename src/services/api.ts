import axios from "axios";
import { Event } from "../types/event";
import { Sport } from "../types/sport";
import { LoginUser } from "../types/login";
import { UserLogin } from "../types/user";
import { Register } from "../types/register";
import { Team } from "../types/team";
import { Match } from "../types/match";
import { useAuth0 } from "@auth0/auth0-react";

const BASE_URL = "http://192.168.54.62:5000/api";
// const BASE_URL = "http://192.168.0.114:5000/api";
// const BASE_URL = "http://192.168.54.12:5000/api";
// const axios = axios.create({ baseURL: BASE_URL });

//register
export const postRegister = async (data: Register) => {
  const response = await axios.post<Register>(
    `${BASE_URL}/account/register`,
    data
  );
  return response.data;
};

//login
export const postLogin = async (data: LoginUser) => {
  const response = await axios.post<LoginUser>(`${BASE_URL}/Auth/login`, data);
  return response.data;
};

//get user info
export const useUserInfo = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getUserInfo = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get<UserLogin>(`${BASE_URL}/account`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  };

  return { getUserInfo };
};

//  get all events
// export const getAllEvents = async () => {
//   const response = await axios.get<Event[]>(`${BASE_URL}/events`, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });
//   return response.data;
// };

// // get event by ID
// export const getEvent = async (id: string) => {
//   const response = await axios.get<Event>(`${BASE_URL}/events/${id}`, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });
//   return response.data;
// };

//  get all events
export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const response = await axios.get<Event[]>(`${BASE_URL}/events`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events");
  }
};

//get eventid by name
export const getEventIdByTitle = async (eventTitle: string): Promise<string> => {
    const response = await axios.get(`${BASE_URL}/events?title=${eventTitle}`)
    const eventId = response.data.id;
    return eventId;
}

// get event by ID
export const getEvent = async (id: string): Promise<Event> => {
  try {
    const response = await axios.get<Event>(`${BASE_URL}/events/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with id ${id}:`, error);
    throw new Error("Failed to fetch event");
  }
};


//create event
export const createEvent = async (data: Event) => {
  const response = await axios.post(`${BASE_URL}/events`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

//update event
export const updateEvent = async (id: string, data: Event) => {
  const response = await axios.put<Event>(`${BASE_URL}/events/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

//delete event
export const deleteEvent = async (id: string) => {
  const response = await axios.delete(`${BASE_URL}/events/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

// //  get all sports
// export const getAllSports = async () => {
//   const response = await axios.get<Sport[]>(`${BASE_URL}/sports`, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });
//   return response.data;
// };

// // get sport by ID
// export const getSport = async (id: string) => {
//   const response = await axios.get<Sport>(`${BASE_URL}/sports/${id}`, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });
//   return response.data;
// };


//  get all sports
export const getAllSports = async (eventId: string): Promise<Sport[]> => {
  try {
    const response = await axios.get<Sport[]>(`${BASE_URL}/events/${eventId}/sports`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching sports:", error);
    throw new Error("Failed to fetch sports");
  }
};

// get sport by ID
export const getSport = async (id: string): Promise<Sport> => {
  try {
    const response = await axios.get<Sport>(`${BASE_URL}/sports/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
// export const createSport = async (data: { title: string; eventId: string}, eventId: string)  => {
//   const response = await axios.post<Sport[]>(`${BASE_URL}/events/${eventId}/sports`, data, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });
//   return response.data;
// };

export const createSport = async (data: Omit<Sport, 'id'>) => {
  const response = await axios.post<Sport>(`${BASE_URL}/events/${data.eventId}/sports`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

//update sport
// export const updateSport = async (id: string, data: Sport) => {
//   const response = await axios.put<Sport>(`${BASE_URL}/sports/${id}`, data, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });
//   return response.data;
// };

export const updateSport = async (id: string, eventId: string, data: Omit<Sport, 'id' | 'eventId'>) => {
  const response = await axios.put<Sport>(`${BASE_URL}/events/${eventId}/sports/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

//delete sport
export const deleteSport = async (id: string, eventId: string) => {
  const response = await axios.delete(`${BASE_URL}/events/${eventId}/sports/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    data: {
      eventId: eventId,  
    },
  });
  return response.data;
};

//  get all teams
export const getAllTeams = async (eventId: string): Promise<Team[]> => {
  const response = await axios.get<Team[]>(`${BASE_URL}/events/${eventId}/teams`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};
//  get all teams
// export const getAllTeams = async (eventTitle: string): Promise<Team[]> => {
//   const eventId = getEventIdByTitle(eventTitle);
//   const response = await axios.get<Team[]>(`${BASE_URL}/events/${eventId}/teams`, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });
//   return response.data;
// };

// get teams by ID
export const getTeam = async (id: string) => {
  const response = await axios.get<Team>(`${BASE_URL}/teams/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

//create teams
export const createTeam = async (eventId: string, data: Team) => {
  const response = await axios.post(`${BASE_URL}/events/${eventId}/teams`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

//update teams
export const updateTeam = async (id: string, eventId: string, data: Team) => {
  const response = await axios.put<Team>(`${BASE_URL}/events/${eventId}/teams/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

//delete teams
export const deleteTeam = async (id: string, eventId: string ) => {
  const response = await axios.delete(`${BASE_URL}/events/${eventId}/teams/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

// //get all match
// export const getAllMatches = async (eventId: string, sportId: string): Promise<Match[]> => {
//   try {
//     const response = await axios.get<Match[]>(`${BASE_URL}/events/${eventId}/sports/${sportId}/matches`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching matches:", error);
//     throw new Error("Failed to fetch matches");
//   }
// };
//get all match
export const getAllMatches = async (eventId: string): Promise<Match[]> => {
  try {
    const response = await axios.get<Match[]>(`${BASE_URL}/events/${eventId}/matches`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) { 
    console.error("Error fetching matches:", error);
    throw new Error("Failed to fetch matches");
  }
};

//get match by id
export const getMatch = async (id: string): Promise<Match> => {
  try {
    const response = await axios.get<Match>(`${BASE_URL}/matches/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching match:", error);
    throw new Error("Failed to fetch match");
  }
};

//create match
export const createMatch = async (eventId: string, data: Match) => {
  const response = await axios.post(`${BASE_URL}/events/${eventId}/matches`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    }
  })
  return response.data;
}

//update match
export const  updateMatch = async (id: string, eventId: string, data: Match) => {
  const response = await axios.put<Match>(`${BASE_URL}/events/${eventId}/matches/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  } )
  return response.data;
}

//delete match 
export const deleteMatch = async (id : string, eventId: string) => {
  const response = await axios.delete(`${BASE_URL}/events/${eventId}/matches/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  return response.data;
}