import axios from "axios";
export const basicURL = "http://localhost:5269";
interface SignupUser {
  email: string;
  password: string;
  nickname?: string;
}

export const signup = async (formData: FormData) => {
  // Print formData for debugging
  for (let pair of formData.entries()) {
    console.log(pair[0] + ", " + pair[1]);
  }
  const response = await axios.post(`${basicURL}/account/register`, formData);
  return response;
};

export const logout = async (jwt: string) => {
  const response = await axios.post(
    `${basicURL}/account/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Cache-Control": "no-cache",
      },
    }
  );
  return response;
};

export const login = async (user: SignupUser) => {
  const response = await axios.post(`${basicURL}/account/login`, user);
  return response;
};

export const refreshToken = async (jwt: string) => {
  const response = await axios.post(
    `${basicURL}/account/refresh-token`,
    {},
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Cache-Control": "no-cache",
      },
    }
  );
  return response;
};

export const getReceiverInfo = async (jwt: string, receiverId: string) => {
  const response = await axios.get(`${basicURL}/account/${receiverId}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response;
};

export const upgradeToVIP = async (jwt: string | null) => {
  const response = await axios.post(
    `${basicURL}/account/upgrade-to-vip`,
    {},
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Cache-Control": "no-cache",
      },
    }
  );
  return response;
};

// Get Categories
export const getAllCategories = async () => {
  const response = await axios.get(`${basicURL}/category`);
  return response;
};

// Create Event
export const createEvent = async (event: any, jwt: string) => {
  const response = await axios.post(`${basicURL}/event`, event, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Cache-Control": "no-cache",
    },
  });
  return response;
};

// Get All Events
export const getAllEvents = async () => {
  const response = await axios.get(`${basicURL}/event`);
  return response;
};

// Get User's Attending EventId and Waiting EventId
export const getUserEvents = async (jwt: string, userId: string) => {
  const response = await axios.get(`${basicURL}/event/${userId}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Cache-Control": "no-cache",
    },
  });
  return response;
};

// Attend Event
export const attendEvent = async (jwt: string, eventId: string) => {
  const response = await axios.post(
    `${basicURL}/event/attend/${eventId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Cache-Control": "no-cache",
      },
    }
  );
  return response;
};

// Withdraw Event
export const withdrawEvent = async (jwt: string, eventId: string) => {
  const response = await axios.delete(`${basicURL}/event/withdraw/${eventId}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Cache-Control": "no-cache",
    },
  });
  return response;
};

// Add to Waitlist
export const addToWaitlist = async (jwt: string, eventId: string) => {
  const response = await axios.post(
    `${basicURL}/event/waitlist/${eventId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Cache-Control": "no-cache",
      },
    }
  );
  return response;
};

// Cancel Waitlist
export const cancelWaitlist = async (jwt: string, eventId: string) => {
  const response = await axios.delete(`${basicURL}/event/waitlist/${eventId}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Cache-Control": "no-cache",
    },
  });
  return response;
};

// Delete Event
export const deleteEvent = async (jwt: string, eventId: string) => {
  const response = await axios.delete(`${basicURL}/event/${eventId}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Cache-Control": "no-cache",
    },
  });
  return response;
};

// Update Event
export const updateEvent = async (jwt: string, eventId: any, event: any) => {
  const response = await axios.put(`${basicURL}/event/${eventId}`, event, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Cache-Control": "no-cache",
    },
  });
  return response;
};

// Get All Notifications
export const getAllNotifications = async (jwt: string) => {
  const response = await axios.get(`${basicURL}/notifications`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Cache-Control": "no-cache",
    },
  });
  return response;
};

// Mark Notification as Read
export const markAsRead = async (jwt: string, id: number) => {
  const response = await axios.put(
    `${basicURL}/notifications/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Cache-Control": "no-cache",
      },
    }
  );
  return response;
};

// Get Chat Messages. For now receiverId is not be used
export const GetChatMessages = async (jwt: string, receiverId: string) => {
  const response = await axios.get(`${basicURL}/message/${receiverId}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response;
};

// Mark Chat Messages as Read
export const markMessagesAsRead = async (jwt: string, receiverId: string) => {
  const response = await axios.put(
    `${basicURL}/message/${receiverId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  return response;
};

// Get all messages
export const getAllMessages = async (jwt: string) => {
  const response = await axios.get(`${basicURL}/message`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response;
};
