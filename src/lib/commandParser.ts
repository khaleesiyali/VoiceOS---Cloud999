// ============================================================
// Voice Command Parser
// Takes raw speech transcript → returns a structured command
// Handles natural phrasing workers would actually say
// ============================================================

export type CommandType =
  | "REPORT_DAMAGE"
  | "ADD_STOCK"
  | "UPDATE_STATUS"
  | "GET_STATUS"
  | "UNKNOWN";

export interface ParsedCommand {
  type: CommandType;
  itemId?: string;
  quantity?: number;
  status?: string;
  raw: string;
}

// Convert spoken number words to integers
const WORD_TO_NUM: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, fifteen: 15, twenty: 20,
  thirty: 30, forty: 40, fifty: 50, sixty: 60,
  seventy: 70, eighty: 80, ninety: 90, hundred: 100,
};

function extractNumber(text: string): number | undefined {
  // Try digit first: "15 units", "50"
  const digitMatch = text.match(/\b(\d+)\b/);
  if (digitMatch) return parseInt(digitMatch[1], 10);

  // Fall back to word: "five units", "twenty"
  for (const [word, num] of Object.entries(WORD_TO_NUM)) {
    if (text.toLowerCase().includes(word)) return num;
  }
  return undefined;
}

function extractItemId(text: string): string | undefined {
  // Matches: "SKU-007", "SKU 007", "sku007"
  const match = text.match(/\bsku[-\s]?(\d{3,4})\b/i);
  if (match) return `SKU-${match[1].padStart(3, "0")}`;
  return undefined;
}

function extractStatus(text: string): string | undefined {
  const t = text.toLowerCase();
  if (t.includes("in stock") || t.includes("instock"))   return "in_stock";
  if (t.includes("ship") || t.includes("shipped"))       return "shipped";
  if (t.includes("damage") || t.includes("damaged"))     return "damaged";
  if (t.includes("spoil") || t.includes("spoiled"))      return "spoiled";
  if (t.includes("reserve") || t.includes("reserved"))   return "reserved";
  return undefined;
}

export function parseCommand(transcript: string): ParsedCommand {
  const t = transcript.toLowerCase().trim();
  const itemId = extractItemId(t);

  // ── REPORT DAMAGE ────────────────────────────────────────
  // "report damage on SKU-007 15 units"
  // "damage SKU-007 five units"
  // "mark SKU-007 as damaged 10 units"
  if (t.includes("damage") || t.includes("damaged")) {
    const quantity = extractNumber(t);
    return { type: "REPORT_DAMAGE", itemId, quantity, raw: transcript };
  }

  // ── ADD STOCK ────────────────────────────────────────────
  // "add 50 units to SKU-001"
  // "add stock SKU-001 fifty"
  if (t.includes("add") && (t.includes("unit") || t.includes("stock") || extractNumber(t))) {
    const quantity = extractNumber(t);
    return { type: "ADD_STOCK", itemId, quantity, raw: transcript };
  }

  // ── UPDATE STATUS ────────────────────────────────────────
  // "mark SKU-006 as reserved"
  // "ship SKU-004"
  // "set SKU-008 to spoiled"
  // "mark SKU-003 in stock"
  if (
    t.includes("mark") ||
    t.includes("set") ||
    t.includes("ship") ||
    t.includes("reserve") ||
    t.includes("spoil")
  ) {
    const status = extractStatus(t);
    return { type: "UPDATE_STATUS", itemId, status, raw: transcript };
  }

  // ── GET STATUS ───────────────────────────────────────────
  // "what is the status of SKU-001"
  // "check SKU-004"
  // "status SKU-002"
  if (
    t.includes("status") ||
    t.includes("check") ||
    t.includes("what is") ||
    t.includes("show me")
  ) {
    return { type: "GET_STATUS", itemId, raw: transcript };
  }

  return { type: "UNKNOWN", raw: transcript };
}
