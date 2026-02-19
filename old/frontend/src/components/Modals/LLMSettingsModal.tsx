import { FiX } from "react-icons/fi";
import type { LLMDto } from "../../domain/DTOs/LLMDto";

type ModalProps = {
    isOpen: boolean,
    selectedLLM: LLMDto | null,
    onModalClose: () => void;
};

function LLMSettingsModal({isOpen, selectedLLM, onModalClose}: ModalProps) {

    if (!isOpen) return null;

    return (
        <>
        </>
    )
}

export default LLMSettingsModal;