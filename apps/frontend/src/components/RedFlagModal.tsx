import type { Coach } from "../../../../packages/shared-types";

interface RedFlagModalProps {
  coach: Coach | null;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function RedFlagModal({
  coach,
  isOpen,
  onCancel,
  onConfirm,
}: RedFlagModalProps) {
  if (!isOpen || !coach) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-error">⚠️ Red Flag Warning</h3>

        <div className="py-4">
          <p className="text-sm mb-4">
            <strong>{coach.name}</strong> has a red flag that requires your
            attention:
          </p>

          <div className="alert alert-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
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
            <span>{coach.redFlagReason}</span>
          </div>

          <p className="text-sm mt-4 text-base-content/70">
            Unlocking this coach will still cost you{" "}
            <strong>{coach.unlockCost} tokens</strong> and grant you{" "}
            <strong>5 XP</strong>.
          </p>
        </div>

        <div className="modal-action">
          <button className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={onConfirm}>
            Unlock Anyway
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onCancel}></div>
    </div>
  );
}
