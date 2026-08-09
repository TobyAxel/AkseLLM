import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";


type ModalProps = {
    isOpen: boolean;
    onClose?: () => void;
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
};

const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
};

function Modal({ isOpen, onClose, size = "md", children }: ModalProps) {
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCloseRef.current?.();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 flex justify-center items-center z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-backdrop opacity-80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal container */}
            <div
                className={`relative bg-linear-to-b from-raised via-raised to-surface w-full ${sizes[size]} mx-4 rounded-xl shadow-2xl border border-line/50 overflow-hidden`}
            >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-line/10 to-transparent pointer-events-none" />

                {children}
            </div>
        </div>,
        document.body
    );
}

export default Modal;