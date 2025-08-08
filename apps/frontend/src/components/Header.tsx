import type { FC } from "react";
import type { User } from "shared-types";

type Props = {
  user?: User;
  cooldownRemaining: number;
};

export const Header: FC<Props> = ({ user, cooldownRemaining }) => {
  return (
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
  );
};
