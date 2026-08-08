import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import { useEffect, useState, type KeyboardEvent } from "react";
import { llmService } from "../../services";
import { useLLMStore } from "../../stores/useLLMStore";
import { FiSend } from "react-icons/fi";
import { useToastStore } from "../../stores/useToastStore";
import { useModalStore } from "../../stores/useModalStore";
import type { Message } from "../../domain";

function TextField() {
    const [input, setInput] = useState("");
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const { selectedLLM, addMessage, confirmMessage, cancelMessage } = useLLMStore();
    const { showError } = useToastStore();
    const { activeModal } = useModalStore();

    const canSend = input.trim().length > 0 && !isSendingMessage;

    useEffect(() => {
        setInput("");
    }, [selectedLLM]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;

        if (activeModal) return;

        e.preventDefault();
        if (canSend) sendMessage();
    };

    const sendMessage = async () => {
        const storedInput = input;
        const tempId = -Date.now();

        const optimistic: Message = {
            id: tempId,
            role: "user",
            content: storedInput,
            createdAt: new Date().toISOString(),
        };

        setInput("");
        setIsSendingMessage(true);
        addMessage(optimistic);

        try {
            const messages = await llmService.sendMessage(selectedLLM!.id, storedInput);

            if (messages.userMessage == null || messages.assistantMessage == null) throw new Error("Unexpected response shape");

            // Replace placeholder & add assistant reply
            confirmMessage(tempId, messages.userMessage);
            addMessage(messages.assistantMessage);
        } catch (e) {
            showError(e instanceof Error ? e.message : "Failed to send message.");
            cancelMessage(tempId);
            setInput(storedInput);
        } finally {
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
                    onKeyDown={handleKeyDown}
                />

                <button
                    className="text-neutral-300 transition cursor-pointer hover:text-white"
                    disabled={!canSend}
                    onClick={sendMessage}
                >
                    <FiSend size={18} />
                </button>
            </div>
        </div>
    );
}

export default TextField;