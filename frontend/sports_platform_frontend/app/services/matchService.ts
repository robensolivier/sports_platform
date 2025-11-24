import useApi from "../hooks/useApi";

const matchService = () => {
  const api = useApi();

  const getMatches = async (status?: "upcoming" | "past") => {
    try {
      let url = "/api/matches/";
      if (status) {
        url += `?status=${status}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching matches:", error);
      throw error;
    }
  };

  return {
    getMatches,
  };
};

export default matchService;
