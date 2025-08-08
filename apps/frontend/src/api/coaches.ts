import type { Coach, User } from "shared-types";

const API_BASE = "http://localhost:3001";

export async function fetchCoaches(): Promise<Coach[]> {
  const response = await fetch(`${API_BASE}/coaches`);

  if (!response.ok) {
    throw new Error("Failed to fetch coaches");
  }

  return response.json();
}

export async function unlockCoach(coachId: string, userId: string) {
  const response = await fetch(`${API_BASE}/coaches/${coachId}/unlock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    const error = await response.text();
    if (response.status === 429) {
      const match = error.match(/Try again in (\d+) seconds/);
      const seconds = match ? parseInt(match[1]) : 5;
      throw new Error(`Rate limit exceeded. Wait ${seconds} seconds.`);
    }
    throw new Error(error || "Failed to unlock coach");
  }

  return response.json();
}

export async function fetchUser(userId: string): Promise<User> {
  const response = await fetch(`${API_BASE}/coaches/user/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}
