import { createPortal } from "react-dom";
import { useLLMStore } from "../stores/useLLMStore";
import Message from "./ui/Message";
import TextField from "./ui/TextField";


function ChatPanel() {
    const { selectedLLM } = useLLMStore();

    if (!selectedLLM) return null;

    return (
        <div className="relative h-dvh w-auto px-20 flex-1">
            <div>
                {selectedLLM.chatHistory?.map((msg, index) => (
                    <Message
                        key={index}
                        role={msg.role}
                        content={msg.content}
                        createdAt={msg.createdAt}
                    />
                ))}
            </div>
            <TextField/>
        </div>
    );
}

export default ChatPanel;