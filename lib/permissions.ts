export function canAccess(role: string, area: "admin" | "educator" | "parent" | "student"){ return role === area; }
