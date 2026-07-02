import { useState, type FormEvent } from "react";
import Modal from "../../ui/Modal";
import LogInView from "./views/LogInView";
import RegisterView from "./views/RegisterView";
import { useModalStore } from "../../../stores/useModalStore";
import { useUserStore } from "../../../stores/useUserStore";
import { authService } from "../../../services/authService";
import { llmService } from "../../../services/llmService";
import { useLLMStore } from "../../../stores/useLLMStore";

function AuthModal() {
    const { activeModal, closeModal } = useModalStore();
    const { setProfile } = useUserStore();
    const { setLLMs } = useLLMStore();
    const [view, setView] = useState<"login" | "register">("login");
    const [error, setError] = useState<string | null>(null);

    const handleLoginSubmit = async (data: { email: string; password: string }) => {
        try {
            setError(null);
            const res = await authService.login(data);
            setProfile(res.user);
            const llms = await llmService.getAll();
            setLLMs(llms);
            closeModal();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Login failed");
        }
    };

    const handleRegisterSubmit = async (data: { username: string; email: string; password: string }) => {
        try {
            setError(null);
            const res = await authService.register(data);
            setProfile(res.user);
            setLLMs([]);
            closeModal();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Registration failed");
        }
    };

    return (
        <Modal isOpen={activeModal === "auth"} size="md">
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-neutral-700/50">
                <h2 className="text-xl font-bold text-white">
                    {view === "login" ? "Log In" : "Create an Account"}
                </h2>
                <div className="h-0.5 w-20 bg-linear-to-r from-neutral-600 to-transparent mt-2 rounded-full" />
            </div>

            {/* Form */}
            <form onSubmit={(e: FormEvent) => e.preventDefault()} className="relative p-6 space-y-5">
                {error && (
                    <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                        {error}
                    </p>
                )}
                {view === "login" ? (
                    <LogInView onSubmit={handleLoginSubmit} onChangeState={() => { setView("register"); setError(null); }} />
                ) : (
                    <RegisterView onSubmit={handleRegisterSubmit} onChangeState={() => { setView("login"); setError(null); }} />
                )}
            </form>
        </Modal>
    );
}

export default AuthModal;