import { useState } from "react"

type StateProps = {
    onChangeState: () => void;
    onModalClose: () => void;
};

function LogInState({ onChangeState, onModalClose }: StateProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <>
            {/* Username Input */}
            <div className="space-y-2">
                <label htmlFor="username" className="block text-neutral-300 text-sm font-medium">
                    Username or Email
                </label>
                <div className="relative">
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-neutral-900/50 text-white px-4 py-2.5 rounded-lg border border-neutral-700 focus:outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all placeholder:text-neutral-500"
                        placeholder="Enter username or email"
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
            <div className="flex relative justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onChangeState}
                    className="absolute left-0 px-5 py-2.5 cursor-pointer bg-neutral-800/50 text-neutral-300 rounded-lg hover:bg-neutral-700/50 transition-all duration-200 font-medium border border-neutral-700/50 hover:border-neutral-600"
                >
                    Register
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
                    disabled={!username.trim() || !password}
                    className="px-5 py-2.5 cursor-pointer bg-linear-to-r from-neutral-700 to-neutral-600 text-white rounded-lg hover:from-neutral-600 hover:to-neutral-500 transition-all duration-200 font-medium shadow-lg shadow-neutral-900/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-neutral-700 disabled:hover:to-neutral-600"
                >
                    Log In
                </button>
            </div>
        </>
    )
}

export default LogInState