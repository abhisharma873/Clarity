export type CheckInAnswer = "yes" | "partly" | "no";

export type CheckInRow = {
  id: string;
  plan_id: string;
  answer: CheckInAnswer;
  note: string | null;
  created_at: string;
};
