import { useEffect } from "react";
import { useLLMStore } from "../stores/useLLMStore";
import Message from "./ui/Message";
import TextField from "./ui/TextField";
import { llmService } from "../services";


function ChatPanel() {
    const { selectedLLM, setMessages, messages } = useLLMStore();

    useEffect(() => {
        setMessages([]);
        
        if (!selectedLLM) return;

        let isCurrent = true;
        
        llmService.getMessages(selectedLLM.id).then((chatMessages) => {
            if (isCurrent) {
                setMessages(chatMessages);
            }
        });

        return () => {
            isCurrent = false;
        };
    }, [selectedLLM]);

    if (!selectedLLM) return null;

    return (
        <div className="relative h-dvh w-auto px-20 flex-1">
            <div>
                {messages?.map((msg, index) => (
                    <Message
                        key={index}
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