import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Coach } from "shared-types";

import { fetchCoaches, unlockCoach, fetchUser } from "./api/coaches";
import { CoachCard } from "./components/CoachCard";
import { RedFlagModal } from "./components/RedFlagModal";

function App() {
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [showRedFlagModal, setShowRedFlagModal] = useState(false);
  const [lastUnlockTime, setLastUnlockTime] = useState<number>(0);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

  const queryClient = useQueryClient();
  const userId = "1"; // For demo
  const UNLOCK_COOLDOWN = 5000; // 5 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastUnlock = now - lastUnlockTime;
      const remaining = Math.max(0, UNLOCK_COOLDOWN - timeSinceLastUnlock);
      setCooldownRemaining(remaining);
    }, 100);

    return () => clearInterval(interval);
  }, [lastUnlockTime, UNLOCK_COOLDOWN]);

  const {
    data: coaches,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["coaches"],
    queryFn: fetchCoaches,
  });

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });

  const unlockMutation = useMutation({
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

  const handleModalCancel = () => {
    setShowRedFlagModal(false);
    setSelectedCoach(null);
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Coach Unlock System</h1>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Available Tokens</div>
            <div className="stat-value text-primary">{user?.tokens || 0}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Experience Points</div>
            <div className="stat-value text-secondary">{user?.xp || 0}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Unlock Status</div>
            <div className="stat-value text-accent">
              {cooldownRemaining > 0 ? (
                <span className="text-warning">
                  {Math.ceil(cooldownRemaining / 1000)}s
                </span>
              ) : (
                <span className="text-success">Ready</span>
              )}
            </div>
            <div className="stat-desc">
              {cooldownRemaining > 0 ? "Cooldown active" : "Can unlock"}
            </div>
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
