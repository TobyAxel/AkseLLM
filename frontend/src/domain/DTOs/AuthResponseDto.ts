import type { Profile } from "../profile";

export type AuthResponseDto = {
    token: string;
    user_profile: Profile;
    message: string;
}