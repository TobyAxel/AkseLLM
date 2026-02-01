import { useState } from "react";
import { FiUser, FiSettings, FiCreditCard, FiLogOut, FiX } from "react-icons/fi";
import AccountState from "./UserSettingsModalStates/AccountState";
import GeneralState from "./UserSettingsModalStates/GeneralState";
import PlanState from "./UserSettingsModalStates/PlanState";
import type { UserData } from "../domain/userdata";

type Tab = {
    id: "account" | "general" | "plan";
    label: string;
    icon: React.ComponentType<{ size?: number }>;
    content?: React.ReactNode;
};

type UserSettingsModalProps = {
    userdata: UserData | null;
    onModalClose: () => void;
    onLogout: () => void;
};

function UserSettingsModal({ userdata, onModalClose, onLogout }: UserSettingsModalProps) {
    const tabs: Tab[] = [
        { id: "general", label: "General", icon: FiSettings, content: <GeneralState/> },
        { id: "account", label: "Account", icon: FiUser, content: <AccountState userdata={userdata}/> },
        { id: "plan", label: "Plan", icon: FiCreditCard, content: <PlanState userdata={userdata}/> }
    ];

    const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);

    return (
        <div className="absolute flex justify-center items-center w-full h-full z-50">
            {/* Backdrop */}
            <div
                className="absolute bg-black w-full h-full opacity-80 backdrop-blur-sm"
                onClick={onModalClose}
            />

            {/* Modal */}
            <div className="relative bg-linear-to-b from-neutral-800 via-neutral-800 to-neutral-900 w-full max-w-2xl mx-4 rounded-xl shadow-2xl border border-neutral-700/50 overflow-hidden">

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-neutral-700/10 to-transparent pointer-events-none" />

                {/* Header */}
                <div className="relative p-6 pb-4 border-b border-neutral-700/50 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold bg-linear-to-r from-white to-neutral-400 bg-clip-text text-white">
                            Settings
                        </h2>
                        <div className="h-0.5 w-20 bg-linear-to-r from-neutral-600 to-transparent mt-2 rounded-full" />
                    </div>
                    <button
                        onClick={onModalClose}
                        className="p-2 rounded-lg hover:bg-neutral-700/50 transition-all duration-200 text-neutral-400 hover:text-white cursor-pointer"
                        aria-label="Close settings"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="relative border-b border-neutral-700/50">
                    <div className="flex px-6">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab.id === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all duration-200 border-b-2 cursor-pointer ${isActive
                                            ? "text-white border-neutral-500"
                                            : "text-neutral-400 border-transparent hover:text-neutral-300"
                                        }`}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="relative p-6 min-h-100">
                    {activeTab.content}
                </div>

                {/* Footer Logout */}
                <div className="relative p-6 pt-4 border-t border-neutral-700/50">
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-5 py-2.5 cursor-pointer bg-linear-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-200 font-medium shadow-lg shadow-red-900/30"
                        aria-label="Logout"
                    >
                        <FiLogOut size={16} />
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserSettingsModal;