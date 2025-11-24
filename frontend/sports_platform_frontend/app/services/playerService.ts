import useApi from "../hooks/useApi";

const playerService = () => {
  const api = useApi();

  const getPlayerProfiles = async () => {
    try {
      const response = await api.get("/players/"); // Assuming /players/ returns a list
      return response.data;
    } catch (error) {
      console.error("Error fetching player profiles:", error);
      throw error;
    }
  };

  // Potentially add a getPlayerProfileById for single profile later if needed
  const getPlayerProfileById = async (id: string) => {
    try {
      // Assuming the backend has an endpoint like /players/{id}/ to fetch a single player
      // Based on urls.py, it's /players/{uuid:pk}/
      const response = await api.get(`/players/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching player profile for ID ${id}:`, error);
      throw error;
    }
  };

  return {
    getPlayerProfiles,
    getPlayerProfileById,
  };
};

export default playerService;