import type { Coach } from "shared-types";

import { CoachCard } from "./components/CoachCard";
import { Header } from "./components/Header.tsx";
import { RedFlagModal } from "./components/RedFlagModal";
import { useCooldownRemaining } from "./hooks/useCooldownRemaining.ts";
import { useFetchCoaches } from "./hooks/useFetchCoaches.ts";
import { useFetchUser } from "./hooks/useFetchUser.ts";
import { useRedFlagModal } from "./hooks/useRedFlagModal.ts";
import { useUnlockMutation } from "./hooks/useUnlockMutation.ts";

const userId = "1"; // For demo

function App() {
  const {
    selectedCoach,
    setSelectedCoach,
    showRedFlagModal,
    setShowRedFlagModal,
    handleModalCancel,
  } = useRedFlagModal();

  const {
    cooldownRemaining,
    lastUnlockTime,
    setLastUnlockTime,
    UNLOCK_COOLDOWN,
  } = useCooldownRemaining();

  const { data: coaches, isLoading, error } = useFetchCoaches();
  const { data: user, isLoading: isLoadingUser } = useFetchUser(userId);
  const unlockMutation = useUnlockMutation({
    userId,
    setSelectedCoach,
    setShowRedFlagModal,
  });

  const handleUnlockClick = (coach: Coach) => {
    if (!user) {
      alert("User data not loaded yet!");
      return;
    }

    if (user.unlockedCoaches.includes(coach.id)) {
      alert("Coach already unlocked!");
      return;
    }

    const now = Date.now();
    const timeSinceLastUnlock = now - lastUnlockTime;

    if (timeSinceLastUnlock < UNLOCK_COOLDOWN) {
      const remainingTime = Math.ceil(
        (UNLOCK_COOLDOWN - timeSinceLastUnlock) / 1000,
      );

      alert(
        `Please wait ${remainingTime} seconds before unlocking another coach.`,
      );

      return;
    }

    if (coach.hasRedFlag) {
      setSelectedCoach(coach);
      setShowRedFlagModal(true);
    } else {
      handleUnlock(coach);
    }
  };

  const handleUnlock = (coach: Coach) => {
    setLastUnlockTime(Date.now());
    unlockMutation.mutate(coach.id);
  };

  const handleModalConfirm = () => {
    if (selectedCoach) {
      handleUnlock(selectedCoach);
    }
  };

  if (isLoading || isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
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
      <Header user={user} cooldownRemaining={cooldownRemaining} />

      {/* Coaches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches?.map((coach) => (
          <CoachCard
            key={coach.id}
            coach={coach}
            onUnlockClick={handleUnlockClick}
            isUnlocked={user?.unlockedCoaches.includes(coach.id) || false}
            isLoading={unlockMutation.isPending}
            userTokens={user?.tokens || 0}
            cooldownRemaining={cooldownRemaining}
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
