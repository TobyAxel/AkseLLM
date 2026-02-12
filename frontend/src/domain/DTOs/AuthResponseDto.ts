import type { Profile } from "../profile";

export type AuthResponseDto = {
    token: string;
    user: Profile;
    message: string;
    success: boolean;
}