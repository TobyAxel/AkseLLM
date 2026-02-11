import { useState } from "react"
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi"

type StateProps = {
    onChangeState: () => void;
    onSubmit: (data: { username: string; password: string }) => void;
};

function LogInState({ onChangeState, onSubmit }: StateProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = () => {
        onSubmit({ username, password });
    };

    return (
        <>
            {/* Username Input */}
            <div className="space-y-2">
                <label htmlFor="username" className="block text-neutral-300 text-sm font-medium">
                    Username or Email
                </label>
                <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-neutral-900/50 text-white pl-10 pr-4 py-2.5 rounded-lg border border-neutral-700 focus:outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all placeholder:text-neutral-500"
                        placeholder="Enter username or email"
                    />
                </div>
            </div>

            {/* Password input */}
            <div className="space-y-2">
                <label htmlFor="password" className="block text-neutral-300 text-sm font-medium">
                    Password
                </label>
                <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-neutral-900/50 text-white pl-10 pr-12 py-2.5 rounded-lg border border-neutral-700 focus:outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all placeholder:text-neutral-500"
                        placeholder="Enter password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-300 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex relative justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onChangeState}
                    aria-label="Switch to registration form"
                    className="absolute left-0 px-5 py-2.5 cursor-pointer bg-neutral-800/50 text-neutral-300 rounded-lg hover:bg-neutral-700/50 transition-all duration-200 font-medium border border-neutral-700/50 hover:border-neutral-600"
                >
                    Register
                </button>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!username.trim() || !password}
                    aria-label="login"
                    className="px-5 py-2.5 cursor-pointer bg-linear-to-r from-neutral-700 to-neutral-600 text-white rounded-lg hover:from-neutral-600 hover:to-neutral-500 transition-all duration-200 font-medium shadow-lg shadow-neutral-900/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-neutral-700 disabled:hover:to-neutral-600"
                >
                    Log In
                </button>
            </div>
        </>
    )
}

export default LogInState