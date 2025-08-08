import { useEffect, useState } from "react";

const UNLOCK_COOLDOWN = 5000; // 5 seconds

export const useCooldownRemaining = () => {
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [lastUnlockTime, setLastUnlockTime] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastUnlock = now - lastUnlockTime;
      const remaining = Math.max(0, UNLOCK_COOLDOWN - timeSinceLastUnlock);
      setCooldownRemaining(remaining);
    }, 100);

    return () => clearInterval(interval);
  }, [lastUnlockTime, UNLOCK_COOLDOWN]);

  return {
    cooldownRemaining,
    lastUnlockTime,
    setLastUnlockTime,
    UNLOCK_COOLDOWN,
  };
};
