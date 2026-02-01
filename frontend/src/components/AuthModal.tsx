import { useState, type FormEvent } from "react";
import LogInState from "./AuthModalStates/LogInState";
import RegisterState from "./AuthModalStates/RegisterState";

type AuthData = {
    type: 'login' | 'register';
    username?: string;
    email?: string;
    password: string;
};

type ModalProps = {
    onSubmit: (data: AuthData) => void;
};

function AuthModal({ onSubmit }: ModalProps) {
    const [modalState, setModalState] = useState<'login' | 'register'>("login");

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Handled by children
    };

    const handleLoginSubmit = (data: { username: string; password: string }) => {
        onSubmit({ type: 'login', ...data });
    };

    const handleRegisterSubmit = (data: { username: string; email: string; password: string }) => {
        onSubmit({ type: 'register', ...data });
    };

    function changeState() {
        setModalState(modalState === "login" ? "register" : "login");
    }

    return (
        <div className="absolute flex justify-center items-center w-full h-full z-50">
            {/* Backdrop */}
            <div className="absolute bg-black w-full h-full opacity-80 backdrop-blur-sm" />
            
            {/* Modal */}
            <div className="relative bg-linear-to-b from-neutral-800 via-neutral-800 to-neutral-900 w-md rounded-xl shadow-2xl border border-neutral-700/50 overflow-hidden">
                
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
                <form onSubmit={handleFormSubmit} className="relative p-6 space-y-5">
                    {modalState === "login" ? 
                        <LogInState onSubmit={handleLoginSubmit} onChangeState={changeState}/> : 
                        <RegisterState onSubmit={handleRegisterSubmit} onChangeState={changeState}/>
                    }
                </form>
            </div>
        </div>
    )
}

export default AuthModal