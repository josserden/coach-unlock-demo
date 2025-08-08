import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Coach } from "../../../packages/shared-types";

import { fetchCoaches } from "./api/coaches";
import { CoachCard } from "./components/CoachCard";
import { RedFlagModal } from "./components/RedFlagModal";

function App() {
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [showRedFlagModal, setShowRedFlagModal] = useState(false);
  const [userTokens, setUserTokens] = useState(25);
  const [userXP, setUserXP] = useState(100);

  const {
    data: coaches,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["coaches"],
    queryFn: fetchCoaches,
  });

  const handleUnlockClick = (coach: Coach) => {
    if (coach.hasRedFlag) {
      setSelectedCoach(coach);
      setShowRedFlagModal(true);
    } else {
      handleUnlock(coach);
    }
  };

  const handleUnlock = (coach: Coach) => {
    // Mock unlock logic
    console.log(
      `Unlocking coach: ${coach.name} for ${coach.unlockCost} tokens`,
    );
    setUserTokens((prev) => prev - coach.unlockCost);
    setUserXP((prev) => prev + 5);

    // Close modal if it was open
    setShowRedFlagModal(false);
    setSelectedCoach(null);
  };

  const handleModalCancel = () => {
    setShowRedFlagModal(false);
    setSelectedCoach(null);
  };

  const handleModalConfirm = () => {
    if (selectedCoach) {
      handleUnlock(selectedCoach);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error">
          <span>Error loading coaches: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Coach Unlock System</h1>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Available Tokens</div>
            <div className="stat-value text-primary">{userTokens}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Experience Points</div>
            <div className="stat-value text-secondary">{userXP}</div>
          </div>
        </div>
      </div>

      {/* Coaches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches?.map((coach) => (
          <CoachCard
            key={coach.id}
            coach={coach}
            onUnlockClick={handleUnlockClick}
          />
        ))}
      </div>

      {/* Red Flag Modal */}
      <RedFlagModal
        coach={selectedCoach}
        isOpen={showRedFlagModal}
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
}

export default App;
