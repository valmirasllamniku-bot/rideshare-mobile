"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  krijoKerkesen,
  ndryshoKerkesen,
} from "@/lib/lejet";

export async function krijoKerkeseAction(formData: FormData) {
  let rezultati: string;

  try {
    rezultati = await krijoKerkesen(
      String(formData.get("projektId") ?? ""),
      String(formData.get("mesazhi") ?? "")
    );
  } catch {
    rezultati = "databaza";
  }

  if (rezultati === "krijuar") {
    revalidatePath("/panel");
    revalidatePath("/");
  }

  redirect("/panel?m=" + rezultati);
}

export async function ruajKerkeseAction(formData: FormData) {
  let rezultati: string;

  try {
    rezultati = await ndryshoKerkesen(
      String(formData.get("id") ?? ""),
      String(formData.get("mesazhi") ?? "")
    );
  } catch {
    rezultati = "databaza";
  }

  if (rezultati === "ruajtur") {
    revalidatePath("/panel");
    revalidatePath("/");
  }

  redirect("/panel?m=" + rezultati);
}