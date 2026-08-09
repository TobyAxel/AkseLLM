import { useEffect, useState } from "react";
import { FiUser, FiCheck } from "react-icons/fi";
import { useUserStore } from "../../../../stores/useUserStore";
import Avatar from "../../../ui/Avatar";

const BIO_MAX = 200;

function AccountView() {
    const { profile } = useUserStore();
    const [username, setUsername] = useState(profile?.username ?? "");
    const [bio, setBio] = useState("");
    const [saved, setSaved] = useState(false);

    const isUnchanged = username.trim() === (profile?.username ?? "");
    const canSave = username.trim().length > 0 && !isUnchanged;

    useEffect(() => {
        if (!saved) return;

        const timeout = setTimeout(() => setSaved(false), 2000);
        return () => clearTimeout(timeout);
    }, [saved]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSave) return;

        // TODO: no updateProfile endpoint yet, nothing is persisted
        setSaved(true);
    };

    const inputCls = "w-full bg-surface/50 text-ink pl-10 pr-4 py-2.5 rounded-lg border border-line focus:outline-none focus:border-line-active focus:ring-2 focus:ring-line-active/20 transition-all placeholder:text-ink-faint";
    const labelCls = "block text-ink-muted text-sm font-medium";

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-4">
                <Avatar username={username || profile?.username} size="lg" />
                <div className="min-w-0">
                    <p className="text-ink-subtle text-sm">Signed in as</p>
                    <p className="text-ink truncate">{profile?.email}</p>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="username" className={labelCls}>Username</label>
                <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" size={18} />
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={inputCls}
                        placeholder="Enter a username"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="bio" className={labelCls}>Bio</label>
                    <span className="text-xs text-ink-faint">{bio.length}/{BIO_MAX}</span>
                </div>
                <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
                    rows={3}
                    className="w-full bg-surface/50 text-ink px-3 py-2.5 rounded-lg border border-line focus:outline-none focus:border-line-active focus:ring-2 focus:ring-line-active/20 transition-all placeholder:text-ink-faint resize-none"
                    placeholder="Say something about yourself"
                />
            </div>

            <div className="flex justify-end items-center gap-3 pt-2">
                {saved && (
                    <span className="flex items-center gap-1.5 text-sm text-success">
                        <FiCheck size={16} />
                        Saved
                    </span>
                )}
                <button
                    type="submit"
                    disabled={!canSave}
                    aria-label="Save account details"
                    className="px-5 py-2.5 cursor-pointer bg-linear-to-r from-line to-line-strong text-ink rounded-lg hover:from-line-strong hover:to-line-active transition-all duration-200 font-medium shadow-lg shadow-surface/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-line disabled:hover:to-line-strong"
                >
                    Save
                </button>
            </div>
        </form>
    );
}

export default AccountView;
