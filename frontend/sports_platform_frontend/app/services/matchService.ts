import useApi from "../hooks/useApi";

const matchService = () => {
  const api = useApi();

  const getMatches = async () => {
    try {
      const response = await api.get("/api/matches/");
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