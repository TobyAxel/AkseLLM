import { create } from "zustand";
import type { LLMModel } from "../domain";

type ActiveModal = "auth" | "userSettings" | "llmCreate" | "llmSettings" | "logoutConfirm" | null;

type ModalStore = {
    activeModal: ActiveModal;
    llmSettingsTarget: LLMModel | null;

    openModal: (modal: ActiveModal, payload?: { llmSettingsTarget?: LLMModel }) => void;
    closeModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
    activeModal: null,
    llmSettingsTarget: null,

    openModal: (modal, payload = {}) => set({ activeModal: modal, ...payload }),
    closeModal: () => set({ activeModal: null, llmSettingsTarget: null }),
}));