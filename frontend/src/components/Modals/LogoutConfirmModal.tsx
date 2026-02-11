import { FiLogOut } from "react-icons/fi"

type logoutConfirmModalProps = {
    onModalClose: () => void;
    logout: () => void;
}

function LogoutConfirmModal({ onModalClose, logout }: logoutConfirmModalProps) {
    return (
        <div className="absolute flex justify-center items-center w-full h-full z-50">
            {/* Backdrop */}
            <div
                className="absolute bg-black w-full h-full opacity-80 backdrop-blur-sm"
                onClick={onModalClose}
            />
            
            {/* Modal */}
            <div className="relative bg-linear-to-b from-neutral-800 via-neutral-800 to-neutral-900 max-w-md w-full mx-4 rounded-xl shadow-2xl border border-neutral-700/50 overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-neutral-700/10 to-transparent pointer-events-none" />
                
                {/* Content */}
                <div className="relative p-6">
                    
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <FiLogOut className="text-red-400" size={24} />
                        </div>
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-xl font-bold text-center text-white mb-2">
                        Log Out
                    </h2>
                    
                    {/* Description */}
                    <p className="text-center text-neutral-400 text-sm mb-6">
                        Are you sure you want to log out? You'll need to sign in again to access your account.
                    </p>
                    
                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onModalClose}
                            aria-label="Cancel logout"
                            className="flex-1 px-5 py-2.5 cursor-pointer bg-neutral-800/50 text-neutral-300 rounded-lg hover:bg-neutral-700/50 transition-all duration-200 font-medium border border-neutral-700/50 hover:border-neutral-600"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={logout}
                            aria-label="logout"
                            className="flex-1 px-5 py-2.5 cursor-pointer bg-linear-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-200 font-medium shadow-lg shadow-red-900/30"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LogoutConfirmModal;