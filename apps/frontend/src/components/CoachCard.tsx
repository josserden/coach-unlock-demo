import type { Coach } from "../../../../packages/shared-types";

interface CoachCardProps {
  coach: Coach;
  onUnlockClick: (coach: Coach) => void;
}

export function CoachCard({ coach, onUnlockClick }: CoachCardProps) {
  const isDisabled = !coach.available;

  return (
    <div className="card bg-base-100 w-full shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h2 className="card-title text-lg">{coach.name}</h2>
          {coach.hasRedFlag && (
            <div className="badge badge-error badge-sm">⚠️ Red Flag</div>
          )}
        </div>

        <div className="space-y-1 text-sm">
          <p>
            <span className="font-semibold">Position:</span> {coach.position}
          </p>
          <p>
            <span className="font-semibold">School:</span> {coach.school}
          </p>
        </div>

        {coach.hasRedFlag && coach.redFlagReason && (
          <div className="alert alert-warning py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.098 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span className="text-xs">{coach.redFlagReason}</span>
          </div>
        )}

        <div className="card-actions justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{coach.unlockCost}</span>
            <span className="text-sm">tokens</span>
          </div>

          <button
            className={`btn btn-primary ${isDisabled ? "btn-disabled" : ""}`}
            onClick={() => onUnlockClick(coach)}
            disabled={isDisabled}
          >
            {isDisabled ? "Unavailable" : "Unlock"}
          </button>
        </div>

        {!coach.available && (
          <div className="text-center">
            <span className="badge badge-neutral">Currently Unavailable</span>
          </div>
        )}
      </div>
    </div>
  );
}
