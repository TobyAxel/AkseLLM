import clsx from "clsx";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

type MessageProps = {
    role: string;
    content: string;
    createdAt: string;
};

function Message({ role, content }: MessageProps) {
    if (role == "system")
        return;

    return (
        <div className={twMerge(clsx("flex w-full", role == "user" ? "justify-end" : "justify-start"))}>
            <div className={twMerge(clsx(
                "w-fit max-w-[50%] px-3 py-2 rounded-lg mt-4",
                role == "user" ? "justify-end bg-neutral-700/70" : "justify-start bg-neutral-800"
            ))}>
                {content}
            </div>
        </div>

    );
}

export default Message;