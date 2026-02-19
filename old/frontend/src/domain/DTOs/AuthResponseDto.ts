import type { Profile } from "../profile";

export type AuthResponseDto = {
    token: string;
    refreshToken: string;
    user: Profile;
    message: string;
    success: boolean;
}