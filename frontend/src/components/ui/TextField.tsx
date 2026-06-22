import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { llmService } from "../../services";
import { useLLMStore } from "../../stores/useLLMStore";
import type { Message } from "../../domain";
import { FiSend } from "react-icons/fi";
import { useToastStore } from "../../stores/useToastStore";

function TextField() {
    const [input, setInput] = useState("");
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const { selectedLLM, addMessage, removeLastMessage } = useLLMStore();
    const { showError } = useToastStore();

    useEffect(() => {
        setInput("")
    }, [selectedLLM]);

    const sendMessage = async () => {
        const storedInput = input;
        setIsSendingMessage(true);
        try {
            const userMessage: Message = {
                role: "user",
                content: input,
                createdAt: new Date().toISOString()
            };
            
            setInput("")
            addMessage(userMessage)
            const message = await llmService.sendMessage(selectedLLM!.id, userMessage);
            addMessage(message)
            setIsSendingMessage(false);

        } catch (e) {
            showError("Failed to send message.");
            removeLastMessage();
            setInput(storedInput)
            setIsSendingMessage(false);
        }
    }

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4">
            <div
                className={twMerge(
                    clsx(
                        "flex items-center gap-2",
                        "bg-neutral-900/80 backdrop-blur-md",
                        "border border-neutral-700",
                        "rounded-2xl px-4 py-3 shadow-lg"
                    )
                )}
            >
                <input
                    className="flex-1 bg-transparent outline-none text-white placeholder:text-neutral-500"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <button
                    className="text-neutral-300 transition cursor-pointer hover:text-white"
                    disabled={!input.trim() || isSendingMessage}
                    onClick={sendMessage}
                >
                    <FiSend size={18} />
                </button>
            </div>
        </div>
    );
}

export default TextField;