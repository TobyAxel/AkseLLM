export type Message = {
    role: "user" | "assistant" | "system";
    content: string;
    createdAt: string; // ISO date string from JSON
};