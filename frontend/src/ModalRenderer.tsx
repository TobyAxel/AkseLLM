import AuthModal from "./components/modals/AuthModal";
import LLMCreateModal from "./components/modals/LLMCreateModal";
import LLMSettingsModal from "./components/modals/LLMSettingsModal";
import LogoutConfirmModal from "./components/modals/LogoutConfirmModal";
import UserSettingsModal from "./components/modals/UserSettingsModal";

function ModalRenderer() {
    return (
        <>
            <AuthModal />
            <LLMCreateModal />
            <LLMSettingsModal />
            <LogoutConfirmModal />
            <UserSettingsModal />
        </>
    );
}

export default ModalRenderer;