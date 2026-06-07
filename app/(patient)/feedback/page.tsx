"use client";
import { useState } from "react";
import Link from "next/link";

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-dvh bg-[#f7faf8] flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-[#e8f5ee] rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[#006c46] text-4xl icon-fill">check_circle</span>
        </div>
        <h2 className="text-2xl font-bold text-[#191c1b] text-center mb-2">Thank You!</h2>
        <p className="text-[#54615b] text-center mb-8">Your feedback helps us improve the clinic experience.</p>
        <Link href="/" className="w-full max-w-xs bg-[#006c46] text-white font-semibold py-4 rounded-2xl text-center">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#f7faf8] flex flex-col">
      <header className="px-6 py-4 flex items-center gap-3 bg-white shadow-sm sticky top-0 z-10">
        <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#e0e3e1]">
          <span className="material-symbols-outlined text-[#191c1b]">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-bold text-[#191c1b] text-lg">Rate Your Visit</h1>
          <p className="text-xs text-[#54615b]">अपना अनुभव साझा करें</p>
        </div>
      </header>

      <main className="flex-1 px-6 pt-8 pb-8 max-w-md mx-auto w-full flex flex-col items-center">
        <div className="w-16 h-16 bg-[#e8f5ee] rounded-2xl flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[#006c46] text-3xl">stethoscope</span>
        </div>
        <h2 className="text-lg font-semibold text-[#191c1b] mb-1">Dr. Priya Sharma</h2>
        <p className="text-sm text-[#54615b] mb-8">General Physician</p>

        <p className="text-base font-medium text-[#191c1b] mb-4 self-start w-full">How was your experience?</p>
        <div className="flex gap-3 mb-8">
          {[1,2,3,4,5].map(star => (
            <button key={star} type="button" onClick={() => setRating(star)}
              className={`text-5xl transition-transform active:scale-110 ${star <= rating ? "text-[#f9a825]" : "text-[#e0e3e1]"}`}>
              ★
            </button>
          ))}
        </div>

        <div className="w-full mb-6">
          <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Comments (optional)</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)}
            rows={4} placeholder="Tell us about your visit..."
            className="w-full bg-white border border-[#bccabf] rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#006c46] resize-none" />
        </div>

        <button
          disabled={rating === 0}
          onClick={() => setSubmitted(true)}
          className="w-full bg-[#006c46] text-white font-semibold py-4 rounded-2xl disabled:opacity-40 active:scale-[0.98] transition-all">
          Submit Feedback
        </button>
      </main>
    </div>
  );
}
