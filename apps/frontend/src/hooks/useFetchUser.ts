import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../api/coaches.ts";

export const useFetchUser = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  });
};
