import apiClient from "./apiClient";

export const eventService = {
  getEvents: async ({
    keyword = "",
    status = "available",
    page = 1,
    size = 10,
    startAt = "2025-01-01",
    endAt = "2100-01-01",
    sortBy = ["id"],
    sortDir = ["desc"]
  } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("size", size);
    if (keyword) params.append("keyword", keyword);
    if (status) params.append("status", status);
    if (startAt) params.append("startAt", startAt);
    if (endAt) params.append("endAt", endAt);

    if (Array.isArray(sortBy)) {
      sortBy.forEach((sb) => params.append("sortBy", sb));
    } else if (sortBy) {
      params.append("sortBy", sortBy);
    }

    if (Array.isArray(sortDir)) {
      sortDir.forEach((sd) => params.append("sortDir", sd));
    } else if (sortDir) {
      params.append("sortDir", sortDir);
    }

    return await apiClient.get(`/events?${params.toString()}`);
  },

  getEventDetail: async (eventId) => {
    return await apiClient.get(`/events/${eventId}`);
  },

  createEvent: async (eventData) => {
    return await apiClient.post("/events", eventData);
  },

  updateEvent: async (eventId, eventData) => {
    return await apiClient.put(`/events/${eventId}`, eventData);
  }
};

export default eventService;

