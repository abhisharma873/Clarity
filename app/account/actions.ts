"use server";

import { revalidatePath } from "next/cache";
import { updateCheckInEmails as updateCheckInEmailsInDb } from "@/lib/profiles/repository";
import { getCurrentUser } from "@/lib/supabase/user";

export async function updateCheckInEmails(enabled: boolean): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    return;
  }

  await updateCheckInEmailsInDb(user.id, enabled);
  revalidatePath("/account");
}
