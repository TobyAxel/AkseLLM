import { useState } from "react";
import { FiUser, FiSettings, FiCreditCard, FiLogOut, FiX } from "react-icons/fi";
import Modal from "../../ui/Modal";
import AccountView from "./views/AccountView";
import GeneralView from "./views/GeneralView";
import PlanView from "./views/PlanView";
import { useModalStore } from "../../../stores/useModalStore";

type TabId = "general" | "account" | "plan";

type Tab = {
    id: TabId;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
    content: React.ReactNode;
};

const tabs: Tab[] = [
    { id: "general", label: "General", icon: FiSettings, content: <GeneralView /> },
    { id: "account", label: "Account", icon: FiUser, content: <AccountView /> },
    { id: "plan", label: "Plan", icon: FiCreditCard, content: <PlanView /> },
];

function UserSettingsModal() {
    const { activeModal, closeModal, openModal } = useModalStore();
    const [activeTabId, setActiveTabId] = useState<TabId>("general");
    const activeTab = tabs.find((t) => t.id === activeTabId)!;

    return (
        <Modal isOpen={activeModal === "userSettings"} onClose={closeModal} size="lg">
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-neutral-700/50 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Settings</h2>
                    <div className="h-0.5 w-20 bg-linear-to-r from-neutral-600 to-transparent mt-2 rounded-full" />
                </div>
                <button
                    onClick={closeModal}
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
                        const isActive = activeTabId === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTabId(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all duration-200 border-b-2 cursor-pointer ${
                                    isActive
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
            <div className="relative p-6 min-h-100">{activeTab.content}</div>

            {/* Footer */}
            <div className="relative p-6 pt-4 border-t border-neutral-700/50">
                <button
                    onClick={() => openModal("logoutConfirm")}
                    className="flex items-center gap-2 px-5 py-2.5 cursor-pointer bg-linear-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-200 font-medium shadow-lg shadow-red-900/30"
                    aria-label="Logout"
                >
                    <FiLogOut size={16} />
                    Log Out
                </button>
            </div>
        </Modal>
    );
}

export default UserSettingsModal;