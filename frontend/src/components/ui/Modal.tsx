import { useEffect } from "react";
import { createPortal } from "react-dom";

type ModalSize = "sm" | "md" | "lg";

type ModalProps = {
    isOpen: boolean;
    onClose?: () => void;
    size?: ModalSize;
    children: React.ReactNode;
};

const sizeClasses: Record<ModalSize, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
};

function Modal({ isOpen, onClose, size = "md", children }: ModalProps) {
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose?.();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 flex justify-center items-center z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black opacity-80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal container */}
            <div
                className={`relative bg-linear-to-b from-neutral-800 via-neutral-800 to-neutral-900 w-full ${sizeClasses[size]} mx-4 rounded-xl shadow-2xl border border-neutral-700/50 overflow-hidden`}
            >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-neutral-700/10 to-transparent pointer-events-none" />

                {children}
            </div>
        </div>,
        document.body
    );
}

export default Modal;