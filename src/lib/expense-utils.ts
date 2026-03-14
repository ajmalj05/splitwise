import type { SplitType, SplitDetails, PaymentEntry } from "@/types";

export function validateAndNormalizeSplit(
  amount: number,
  splitType: SplitType,
  splitDetails: SplitDetails,
  memberIds: string[]
): { [userId: string]: number } {
  if (splitType === "equal") {
    const share = Math.round((amount / memberIds.length) * 100) / 100;
    const shares: { [userId: string]: number } = {};
    memberIds.forEach((id) => (shares[id] = share));
    const diff = amount - share * memberIds.length;
    if (memberIds.length && diff !== 0) {
      shares[memberIds[0]] = Math.round((shares[memberIds[0]] + diff) * 100) / 100;
    }
    return shares;
  }

  if (splitType === "unequal") {
    const total = Object.values(splitDetails).reduce((a, b) => a + b, 0);
    if (Math.abs(total - amount) > 0.01) {
      throw new Error("Split amounts must sum to expense amount");
    }
    return { ...splitDetails };
  }

  if (splitType === "percentage") {
    const totalPct = Object.values(splitDetails).reduce((a, b) => a + b, 0);
    if (Math.abs(totalPct - 100) > 0.01) {
      throw new Error("Percentages must sum to 100");
    }
    const shares: { [userId: string]: number } = {};
    for (const [userId, pct] of Object.entries(splitDetails)) {
      shares[userId] = Math.round((amount * (pct / 100)) * 100) / 100;
    }
    const diff = amount - Object.values(shares).reduce((a, b) => a + b, 0);
    const firstKey = Object.keys(shares)[0];
    if (firstKey && diff !== 0) {
      shares[firstKey] = Math.round((shares[firstKey] + diff) * 100) / 100;
    }
    return shares;
  }

  throw new Error("Invalid split type");
}

export function validatePayments(payments: PaymentEntry[], amount: number): void {
  const total = payments.reduce((s, p) => s + p.amount, 0);
  if (Math.abs(total - amount) > 0.01) {
    throw new Error("Payments must sum to expense amount");
  }
}

export function computeBalances(
  expenses: {
    splitDetails: Record<string, number>;
    payments: { userId: string; amount: number }[];
  }[]
): Map<string, number> {
  const balances = new Map<string, number>();

  for (const exp of expenses) {
    for (const [userId, share] of Object.entries(exp.splitDetails)) {
      const current = balances.get(userId) ?? 0;
      balances.set(userId, current - share);
    }
    for (const p of exp.payments) {
      const uid = typeof p.userId === "string" ? p.userId : (p.userId as { toString: () => string }).toString();
      const current = balances.get(uid) ?? 0;
      balances.set(uid, current + p.amount);
    }
  }

  return balances;
}
