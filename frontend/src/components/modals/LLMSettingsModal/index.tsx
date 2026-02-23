import { FiX } from "react-icons/fi";
import Modal from "../../ui/Modal";
import { useModalStore } from "../../../stores/useModalStore";

function LLMSettingsModal() {
    const { activeModal, closeModal, llmSettingsTarget } = useModalStore();

    return (
        <Modal isOpen={activeModal === "llmSettings"} onClose={closeModal} size="md">
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-neutral-700/50 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">
                        {llmSettingsTarget?.name ?? "LLM Settings"}
                    </h2>
                    <div className="h-0.5 w-20 bg-linear-to-r from-neutral-600 to-transparent mt-2 rounded-full" />
                </div>
                <button
                    onClick={closeModal}
                    className="p-2 rounded-lg hover:bg-neutral-700/50 transition-all duration-200 text-neutral-400 hover:text-white cursor-pointer"
                    aria-label="Close LLM settings"
                >
                    <FiX size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="relative p-6">
                {/* TODO: LLM settings content using llmSettingsTarget */}
            </div>
        </Modal>
    );
}

export default LLMSettingsModal;