import { useQuery } from "@tanstack/react-query";
import { fetchCoaches } from "../api/coaches.ts";

export const useFetchCoaches = () => {
  return useQuery({
    queryKey: ["coaches"],
    queryFn: fetchCoaches,
  });
};
