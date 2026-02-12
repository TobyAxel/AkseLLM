import type { Profile } from "../../../domain/profile";

type AccountStateProps = {
    userprofile: Profile | null;
};

function AccountState({ userprofile }: AccountStateProps) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
                <p className="text-neutral-400 text-sm">Account settings</p>
            </div>

            {/* User Info Display */}
            <div className="space-y-3 pt-4 border-t border-neutral-700/50">
                <div className="flex items-center gap-6">
                    <img
                        src="/blank-pfp.png"
                        className="w-16 h-16 rounded-full ring-2 ring-neutral-700"
                        alt="Profile"
                    />
                    <div>
                        <p className="text-sm font-medium text-neutral-300">Username</p>
                        <p className="text-white font-semibold">{userprofile?.username || ""}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountState;
