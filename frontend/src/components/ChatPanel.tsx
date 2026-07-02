import { useEffect } from "react";
import { useLLMStore } from "../stores/useLLMStore";
import Message from "./ui/Message";
import TextField from "./ui/TextField";
import { llmService } from "../services";
import { useToastStore } from "../stores/useToastStore";


function ChatPanel() {
    const { selectedLLM, setMessages, messages } = useLLMStore();
    const { showError } = useToastStore();

    useEffect(() => {
        setMessages([]);
        
        if (!selectedLLM) return;

        let isCurrent = true;
        
        llmService.getMessages(selectedLLM.id).then((chatMessages) => {
            if (isCurrent) {
                setMessages(chatMessages);
            }
        }).catch((error) => {
            showError(error.message || "Failed to fetch chat messages.");
        });

        return () => {
            isCurrent = false;
        };
    }, [selectedLLM]);

    if (!selectedLLM) return null;

    return (
        <div className="relative h-dvh w-auto px-20 flex-1">
            <div>
                {messages?.map((msg) => (
                    <Message
                        key={msg.id}
                        id={msg.id}
                        role={msg.role}
                        content={msg.content}
                        createdAt={msg.createdAt}
                    />
                ))}
            </div>
            <TextField />
        </div>
    );
}

export default ChatPanel;