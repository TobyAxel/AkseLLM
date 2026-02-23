import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile } from "../domain";

type UserStore = {
    profile: UserProfile | null;
    setProfile: (profile: UserProfile) => void;
    clearProfile: () => void;
};

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            profile: null,
            setProfile: (profile) => set({ profile }),
            clearProfile: () => set({ profile: null }),
        }),
        { name: "user-store" }
    )
);