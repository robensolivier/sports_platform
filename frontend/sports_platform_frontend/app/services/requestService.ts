import useApi from "../hooks/useApi";

const requestService = () => {
  const api = useApi();

  const getJoinRequests = async () => {
    try {
      const response = await api.get("/api/join-requests/");
      return response.data;
    } catch (error) {
      console.error("Error fetching join requests:", error);
      throw error;
    }
  };

  const acceptJoinRequest = async (requestId: number) => {
    try {
      const response = await api.patch(`/api/join-requests/${requestId}/`, { status: "accepted" });
      return response.data;
    } catch (error) {
      console.error(`Error accepting join request ${requestId}:`, error);
      throw error;
    }
  };

  const rejectJoinRequest = async (requestId: number) => {
    try {
      const response = await api.patch(`/api/join-requests/${requestId}/`, { status: "rejected" });
      return response.data;
    } catch (error) {
      console.error(`Error rejecting join request ${requestId}:`, error);
      throw error;
    }
  };

  return {
    getJoinRequests,
    acceptJoinRequest,
    rejectJoinRequest,
  };
};

export default requestService;