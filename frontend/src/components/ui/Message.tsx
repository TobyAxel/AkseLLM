import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type MessageProps = {
    role: string;
    content: string;
    createdAt: string;
};

function Message({ role, content, createdAt }: MessageProps) {
    if (role === "system") return null;

    return (
        <div
            className={twMerge(
                clsx(
                    "flex w-full mt-4",
                    role === "user" ? "justify-end" : "justify-start"
                )
            )}
        >
            <div className="flex flex-col max-w-[50%]">
                <div
                    className={twMerge(
                        clsx(
                            "w-fit px-3 py-2 rounded-lg",
                            role === "user"
                                ? "bg-neutral-700/70 self-end"
                                : "bg-neutral-800 self-start"
                        )
                    )}
                >
                    {content}
                </div>
            </div>
        </div>
    );
}

export default Message;