import type { Coach } from "../../../../packages/shared-types";

const API_BASE = "http://localhost:3001";

export async function fetchCoaches(): Promise<Coach[]> {
  const response = await fetch(`${API_BASE}/coaches`);

  if (!response.ok) {
    throw new Error("Failed to fetch coaches");
  }

  return response.json();
}
