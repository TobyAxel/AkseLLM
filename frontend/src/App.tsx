import { useEffect, useState } from "react";
import SideBar from "./components/SideBar";
import ModalRenderer from "./ModalRenderer";
import { useUserStore } from "./stores/useUserStore";
import { useModalStore } from "./stores/useModalStore";
import { useLLMStore } from "./stores/useLLMStore";
import { authService } from "./services/authService";
import { llmService } from "./services/llmService";

function App() {
    const { setProfile } = useUserStore();
    const { openModal } = useModalStore();
    const { setLLMs } = useLLMStore();
    const [loading, setLoading] = useState(true);

    // Check for existing session on mount, hydrate stores if valid
    useEffect(() => {
        authService.me()
            .then(async (res) => {
                setProfile(res.user);
                const llms = await llmService.getAll();
                setLLMs(llms);
            })
            .catch(() => {
                // No active session = show auth modal
                openModal("auth");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return null;

    return (
        <div className="flex">
            <SideBar />
            <ModalRenderer />
        </div>
    );
}

export default App;