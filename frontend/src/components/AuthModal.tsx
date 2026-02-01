import { useState } from "react";
import LogInState from "./AuthModalStates/LogInState";
import RegisterState from "./AuthModalStates/RegisterState";

type ModalProps = {
    onModalClose: () => void;
};

function AuthModal({ onModalClose }: ModalProps) {
    const [modalState, setModalState] = useState("login");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        return
    };

    function changeState() {
        if (modalState === "login") setModalState("register");
        else setModalState("login")
    }

    return (
        <div className="absolute flex justify-center items-center w-full h-full z-50">
            {/* Backdrop */}
            <div
                className="absolute bg-black w-full h-full opacity-80 backdrop-blur-sm"
                onClick={onModalClose}
            />

            {/* Modal */}
            <div className="relative bg-linear-to-b from-neutral-800 via-neutral-850 to-neutral-900 w-md rounded-xl shadow-2xl border border-neutral-700/50 overflow-hidden">

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-neutral-700/10 to-transparent pointer-events-none" />

                {/* Header */}
                <div className="relative p-6 pb-4 border-b border-neutral-700/50">
                    <h2 className="text-xl font-bold bg-linear-to-r from-white to-neutral-400 bg-clip-text text-white">
                        {modalState === "login" ? "Log In" : "Create an Account"}
                    </h2>
                    <div className="h-0.5 w-20 bg-linear-to-r from-neutral-600 to-transparent mt-2 rounded-full" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="relative p-6 space-y-5">
                    {modalState === "login" ? 
                    <LogInState onChangeState={changeState} onModalClose={onModalClose}/> : 
                    <RegisterState onChangeState={changeState} onModalClose={onModalClose}/>}
                </form>
            </div>
        </div>
    )
}

export default AuthModal