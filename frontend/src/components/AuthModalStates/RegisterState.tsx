import { useState } from "react"

type StateProps = {
    onChangeState: () => void;
    onModalClose: () => void;
};

function RegisterState({ onChangeState, onModalClose }: StateProps) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <>
            {/* Username Input */}
            <div className="space-y-2">
                <label htmlFor="username" className="block text-neutral-300 text-sm font-medium">
                    Username
                </label>
                <div className="relative">
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-neutral-900/50 text-white px-4 py-2.5 rounded-lg border border-neutral-700 focus:outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all placeholder:text-neutral-500"
                        placeholder="Enter username"
                        autoFocus
                    />
                </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
                <label htmlFor="email" className="block text-neutral-300 text-sm font-medium">
                    Email
                </label>
                <div className="relative">
                    <input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-neutral-900/50 text-white px-4 py-2.5 rounded-lg border border-neutral-700 focus:outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all placeholder:text-neutral-500"
                        placeholder="Enter email"
                        autoFocus
                    />
                </div>
            </div>

            {/* Password input */}
            <div className="space-y-2">
                <label htmlFor="password" className="block text-neutral-300 text-sm font-medium">
                    Password
                </label>
                <div className="relative">
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-neutral-900/50 text-white px-4 py-2.5 rounded-lg border border-neutral-700 focus:outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all placeholder:text-neutral-500"
                        placeholder="Enter password"
                        autoFocus
                    />
                </div>
            </div>

            {/* Buttons */}
            <div className="relative flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onChangeState}
                    className="absolute left-0 px-5 py-2.5 cursor-pointer bg-neutral-800/50 text-neutral-300 rounded-lg hover:bg-neutral-700/50 transition-all duration-200 font-medium border border-neutral-700/50 hover:border-neutral-600"
                >
                    Log In
                </button>
                <button
                    type="button"
                    onClick={onModalClose}
                    className="px-5 py-2.5 cursor-pointer bg-neutral-800/50 text-neutral-300 rounded-lg hover:bg-neutral-700/50 transition-all duration-200 font-medium border border-neutral-700/50 hover:border-neutral-600"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!username.trim() || !email.trim() || !password}
                    className="px-5 py-2.5 cursor-pointer bg-linear-to-r from-neutral-700 to-neutral-600 text-white rounded-lg hover:from-neutral-600 hover:to-neutral-500 transition-all duration-200 font-medium shadow-lg shadow-neutral-900/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-neutral-700 disabled:hover:to-neutral-600"
                >
                    Create Account
                </button>
            </div>
        </>
    )
}

export default RegisterState