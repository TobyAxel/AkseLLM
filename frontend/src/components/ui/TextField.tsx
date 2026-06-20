import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import { FiSend } from "react-icons/fi";
import { useState } from "react";

function TextField() {
    const [message, setMessage] = useState("");
    

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
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <button 
                    className={twMerge(clsx("text-neutral-300 transition cursor-pointer hover:text-white"))}
                    disabled={!message.trim()}
                >
                    <FiSend size={18} />
                </button>
            </div>
        </div>
    );
}

export default TextField;