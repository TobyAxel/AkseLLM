import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import Modal from "../../ui/Modal";
import { useModalStore } from "../../../stores/useModalStore";
import { useUserStore } from "../../../stores/useUserStore";
import { useLLMStore } from "../../../stores/useLLMStore";
import { authService } from "../../../services/authService";

function LogoutConfirmModal() {
    const { activeModal, closeModal, openModal } = useModalStore();
    const { clearProfile } = useUserStore();
    const { setLLMs, selectLLM } = useLLMStore();
    const [error, setError] = useState<string | null>(null);

    const handleLogout = async () => {
        try {
            await authService.logout();
            clearProfile();
            setLLMs([]);
            selectLLM(null);
            openModal("auth"); // return to auth modal after logout
        } catch (e) {
            setError(e instanceof Error ? e.message : "Logout failed");
        }
    };

    return (
        <Modal isOpen={activeModal === "logoutConfirm"} onClose={closeModal} size="sm">
            <div className="relative p-6">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <FiLogOut className="text-red-400" size={24} />
                    </div>
                </div>

                <h2 className="text-xl font-bold text-center text-white mb-2">Log Out</h2>

                <p className="text-center text-neutral-400 text-sm mb-6">
                    Are you sure you want to log out? You'll need to sign in again to access your account.
                </p>

                {error && (
                    <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2 mb-4 text-center">
                        {error}
                    </p>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={closeModal}
                        aria-label="Cancel logout"
                        className="flex-1 px-5 py-2.5 cursor-pointer bg-neutral-800/50 text-neutral-300 rounded-lg hover:bg-neutral-700/50 transition-all duration-200 font-medium border border-neutral-700/50 hover:border-neutral-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleLogout}
                        aria-label="Logout"
                        className="flex-1 px-5 py-2.5 cursor-pointer bg-linear-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-200 font-medium shadow-lg shadow-red-900/30"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default LogoutConfirmModal;