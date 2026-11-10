"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { parseReview } from "@/lib/review-validation";

// What the review form shows after a submit.
export type ReviewFormState = { error?: string; message?: string } | undefined;

// Postgres error codes we turn into friendly messages.
const UNIQUE_VIOLATION = "23505";
const FOREIGN_KEY_VIOLATION = "23503";

export async function submitReview(
  _state: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const listingId = String(formData.get("listingId") ?? "");
  const parsed = parseReview(formData.get("rating"), formData.get("comment"));
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();

  // Server actions can be called directly, so check the login here, not just in the UI.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Log in to leave a review." };

  // user_id always comes from the session, never from the form.
  const { error } = await supabase.from("reviews").insert({
    listing_id: listingId,
    user_id: user.id,
    rating: parsed.review.rating,
    comment: parsed.review.comment,
  });

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      return { error: "You have already reviewed this listing." };
    }
    if (error.code === FOREIGN_KEY_VIOLATION) return { error: "That listing no longer exists." };
    console.error(`Could not save review: ${error.message}`);
    return { error: "Could not save your review. Please try again." };
  }

  // The listing page and the browse page (average ratings) both show reviews.
  revalidatePath(`/listings/${listingId}`);
  revalidatePath("/");
  return { message: "Thanks! Your review was posted." };
}
