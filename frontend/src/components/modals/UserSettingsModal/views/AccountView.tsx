import { useState } from "react";
import { useUserStore } from "../../../../stores/useUserStore";
import Avatar from "../../../ui/Avatar";

function AccountView() {
    const { profile } = useUserStore();
    const [username, setUsername] = useState(profile?.username ?? "");
    const [bio, setBio] = useState("");
    const [saved, setSaved] = useState(false);

    const isUnchanged = username.trim() === (profile?.username ?? "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || isUnchanged) return;

        // TODO: wire up to a real authService.updateProfile or similar
        console.log("Would save username:", username.trim());

        setSaved(true);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
                <p className="text-neutral-400 text-sm">Account settings</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-neutral-700/50">
                <div className="flex items-center gap-6">
                    <Avatar username={profile?.username} size="lg" />
                    <div>
                        <p className="text-sm font-medium text-neutral-300">Username</p>
                        <p className="text-white font-semibold">{profile?.username ?? ""}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountView;