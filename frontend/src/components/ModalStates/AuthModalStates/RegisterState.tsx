import { useState } from "react"
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi"

type StateProps = {
    onChangeState: () => void;
    onSubmit: (data: { username: string; email: string; password: string }) => void;
};

function RegisterState({ onChangeState, onSubmit }: StateProps) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = () => {
        onSubmit({ username, email, password });
    };

    const isFormValid =
        username.trim() &&
        email.trim() &&
        password &&
        password === confirmPassword &&
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password);

    return (
        <>
            {/* Username Input */}
            <div className="space-y-2">
                <label htmlFor="username" className="block text-neutral-300 text-sm font-medium">
                    Username
                </label>
                <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-neutral-900/50 text-white pl-10 pr-4 py-2.5 rounded-lg border border-neutral-700 focus:outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all placeholder:text-neutral-500"
                        placeholder="Enter username"
                    />
                </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
                <label htmlFor="email" className="block text-neutral-300 text-sm font-medium">
                    Email
                </label>
                <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-neutral-900/50 text-white pl-10 pr-4 py-2.5 rounded-lg border border-neutral-700 focus:outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all placeholder:text-neutral-500"
                        placeholder="Enter email"
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

                {/* Password Requirements */}
                {password && (
                    <div className="space-y-1 text-xs mt-2">
                        <div className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-400' : 'text-neutral-500'}`}>
                            <span>{password.length >= 8 ? '✓' : '○'}</span>
                            <span>At least 8 characters</span>
                        </div>
                        <div className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-green-400' : 'text-neutral-500'}`}>
                            <span>{/[A-Z]/.test(password) ? '✓' : '○'}</span>
                            <span>One uppercase letter</span>
                        </div>
                        <div className={`flex items-center gap-2 ${/[a-z]/.test(password) ? 'text-green-400' : 'text-neutral-500'}`}>
                            <span>{/[a-z]/.test(password) ? '✓' : '○'}</span>
                            <span>One lowercase letter</span>
                        </div>
                        <div className={`flex items-center gap-2 ${/[0-9]/.test(password) ? 'text-green-400' : 'text-neutral-500'}`}>
                            <span>{/[0-9]/.test(password) ? '✓' : '○'}</span>
                            <span>One number</span>
                        </div>
                        <div className={`flex items-center gap-2 ${/[^A-Za-z0-9]/.test(password) ? 'text-green-400' : 'text-neutral-500'}`}>
                            <span>{/[^A-Za-z0-9]/.test(password) ? '✓' : '○'}</span>
                            <span>One special character</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Password input */}
            <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-neutral-300 text-sm font-medium">
                    Confirm Password
                </label>
                <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                    <input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-neutral-900/50 text-white pl-10 pr-4 py-2.5 rounded-lg border border-neutral-700 focus:outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all placeholder:text-neutral-500"
                        placeholder="Re-enter password"
                    />
                </div>
                {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                )}
            </div>

            {/* Buttons */}
            <div className="relative flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onChangeState}
                    aria-label="Change to login form"
                    className="absolute left-0 px-5 py-2.5 cursor-pointer bg-neutral-800/50 text-neutral-300 rounded-lg hover:bg-neutral-700/50 transition-all duration-200 font-medium border border-neutral-700/50 hover:border-neutral-600"
                >
                    Log In
                </button>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    aria-label="register"
                    className="px-5 py-2.5 cursor-pointer bg-linear-to-r from-neutral-700 to-neutral-600 text-white rounded-lg hover:from-neutral-600 hover:to-neutral-500 transition-all duration-200 font-medium shadow-lg shadow-neutral-900/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-neutral-700 disabled:hover:to-neutral-600"
                >
                    Create Account
                </button>
            </div>
        </>
    )
}

export default RegisterState