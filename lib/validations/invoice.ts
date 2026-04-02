export function calculateCommission(amount: number){ const platform = amount * 0.30; const educator = amount * 0.70; return { amount, platform, educator }; }
