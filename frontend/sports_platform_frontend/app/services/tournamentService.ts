// services/tournamentService.ts

export const tournamentService = (api: any) => {
  const getTournaments = async () => {
    try {
      const response = await api.get("/tournaments/");
      return response.data;
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      throw error;
    }
  };

  const getOrganizerTournaments = async () => {
    try {
      const response = await api.get("/tournaments/");
      return response.data;
    } catch (error) {
      console.error("Error fetching organizer's tournaments:", error);
      throw error;
    }
  };

  return {
    getTournaments,
    getOrganizerTournaments,
  };
};

export default tournamentService;
