import { useState } from "react";
import type { Coach } from "shared-types";

export const useRedFlagModal = () => {
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [showRedFlagModal, setShowRedFlagModal] = useState(false);

  const handleModalCancel = () => {
    setShowRedFlagModal(false);
    setSelectedCoach(null);
  };

  return {
    selectedCoach,
    setSelectedCoach,
    showRedFlagModal,
    setShowRedFlagModal,
    handleModalCancel,
  };
};
