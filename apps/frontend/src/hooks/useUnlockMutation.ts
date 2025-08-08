import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import type { Coach } from "shared-types";
import { unlockCoach } from "../api/coaches.ts";

type Props = {
  userId: string;
  setSelectedCoach: React.Dispatch<React.SetStateAction<Coach | null>>;
  setShowRedFlagModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useUnlockMutation = ({
  userId,
  setShowRedFlagModal,
  setSelectedCoach,
}: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (coachId: string) => unlockCoach(coachId, userId),
    onSuccess: (data) => {
      queryClient.setQueryData(["user", userId], data.updatedUser);

      if (data.showRedFlagWarning) {
        setSelectedCoach(data.coach);
        setShowRedFlagModal(true);
      } else {
        setShowRedFlagModal(false);
        setSelectedCoach(null);
      }
    },
    onError: (error) => {
      console.error("Unlock failed:", error);
      alert(`Failed to unlock coach: ${error.message}`);
    },
  });
};
