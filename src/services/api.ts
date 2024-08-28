import axios from "axios";
import { Event } from "../types/event";
import { Sport } from "../types/sport";
import { LoginUser } from "../types/login";
import { UserLogin } from "../types/user";
import { Register } from "../types/register";

const BASE_URL = "http://localhost:8080";
// const axios = axios.create({ baseURL: BASE_URL });


//register 
export const postRegister = async (data: Register) => {
  const response = await axios.post<Register>(
    `${BASE_URL}/account/register`, data
  );
  return response.data;
}

//login
export const postLogin = async (data: LoginUser) => {
  const response = await axios.post<LoginUser>(
    `${BASE_URL}/account/login`,
    data
  );
  return response.data;
};

//get user info
export const getUserInfo = async () => {
  const response = await axios.get<UserLogin>(
    `${BASE_URL}/account`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
};

//  get all events
export const getAllEvents = async () => {
    const response = await axios.get<Event[]>(`${BASE_URL}/events`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
};

// get event by ID
export const getEvent = async (id: string) => {
  
    const response = await axios.get<Event>(`${BASE_URL}/events/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
};


//create event
export const createEvent = async (data: Event) => {
 const response = await axios.post(`${BASE_URL}/events`, data, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
 });
 return response.data;
};

//update event
export const updateEvent = async (id: string, data: Event) => {
  const response = await axios.put<Event>(`${BASE_URL}/events/${id}`, data, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  });
  return response.data;
};

//delete event
export const deleteEvent = async (id: string) => {
  const response = await axios.delete(`${BASE_URL}/events/${id}`, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  });
  return response.data;
};

//  get all sports
export const getAllSports = async () => {
  const response = await axios.get<Sport[]>(`${BASE_URL}/sports`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

// get sport by ID
export const getSport = async (id: string) => {

  const response = await axios.get<Sport>(`${BASE_URL}/sports/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

//create sport
export const createSport = async (data: Sport) => {
  const response = await axios.post(`${BASE_URL}/sports`, data, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  });
  return response.data;
};

//update sport
export const updateSport = async (id: string, data: Sport) => {
  const response = await axios.put<Sport>(`${BASE_URL}/sports/${id}`, data, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  });
  return response.data;
};

//delete sport
export const deleteSport = async (id: string) => {
  const response = await axios.delete(`${BASE_URL}/sports/${id}`, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  });
  return response.data;
};
