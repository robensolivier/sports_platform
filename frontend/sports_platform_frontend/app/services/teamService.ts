import useApi from "../hooks/useApi";

// Typage strict pour les équipes
export type TeamResponse = {
  id: string;
  name: string;
  sport: string;
  members_count: number;
};

export type TeamPayload = {
  name: string;
  sport: string;
};

const teamService = () => {
  const api = useApi();

  const getTeams = async (): Promise<TeamResponse[]> => {
    try {
      const response = await api.get("/tournaments/teams/"); 
      // Forcer le typage et s'assurer que sport est string
      return response.data.map((team: any) => ({
        id: String(team.id),
        name: String(team.name),
        sport: String(team.sport),
        members_count: Number(team.members_count),
      }));
    } catch (error) {
      console.error("Error fetching teams:", error);
      throw error;
    }
  };

  const getTeamById = async (id: string): Promise<TeamResponse> => {
    try {
      const response = await api.get(`/tournaments/teams/${id}/`);
      const team = response.data;
      return {
        id: String(team.id),
        name: String(team.name),
        sport: String(team.sport),
        members_count: Number(team.members_count),
      };
    } catch (error) {
      console.error(`Error fetching team for ID ${id}:`, error);
      throw error;
    }
  };

  const createTeam = async (teamData: TeamPayload): Promise<TeamResponse> => {
    try {
      const response = await api.post("/tournaments/teams/", teamData);
      const team = response.data;
      return {
        id: String(team.id),
        name: String(team.name),
        sport: String(team.sport),
        members_count: Number(team.members_count),
      };
    } catch (error) {
      console.error("Error creating team:", error);
      throw error;
    }
  };

  return {
    getTeams,
    getTeamById,
    createTeam,
  };
};

export default teamService;
