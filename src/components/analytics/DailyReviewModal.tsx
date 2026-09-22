import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useAppStore } from '../../store/useAppStore';
import { getTodayDateString } from '../../utils/dateUtils';
import { Star, Trophy, AlertCircle, BookOpen } from 'lucide-react';

export const DailyReviewModal: React.FC = () => {
  const { reviewModalOpen, setReviewModalOpen, submitDailyReview, dailyReviews } = useAppStore();
  const today = getTodayDateString();
  const existingReview = dailyReviews.find((r) => r.date === today);

  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [wins, setWins] = useState(existingReview?.wins || '');
  const [blockers, setBlockers] = useState(existingReview?.blockers || '');
  const [notes, setNotes] = useState(existingReview?.notes || '');

  useEffect(() => {
    if (reviewModalOpen) {
      setRating(existingReview?.rating || 5);
      setWins(existingReview?.wins || '');
      setBlockers(existingReview?.blockers || '');
      setNotes(existingReview?.notes || '');
    }
  }, [reviewModalOpen, existingReview]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitDailyReview({
      date: today,
      rating,
      wins: wins.trim(),
      blockers: blockers.trim(),
      notes: notes.trim(),
    });
  };

  return (
    <Modal
      isOpen={reviewModalOpen}
      onClose={() => setReviewModalOpen(false)}
      title="End-of-Day Accountability & Reflection"
      subtitle={`Reflect on your focus, academic progress, and blockers for ${today}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1-5 Star Focus Rating */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            How would you rate today's focus and productivity?
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={`p-2 rounded-xl border transition-all ${
                  star <= rating
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 scale-105'
                    : 'bg-dark-800 text-slate-600 border-slate-700/60 hover:text-slate-400'
                }`}
              >
                <Star className="w-6 h-6 fill-current" />
              </button>
            ))}
            <span className="text-xs font-mono font-bold text-amber-400 ml-2">
              {rating === 5
                ? '5/5 (Mastery Day!)'
                : rating === 4
                ? '4/5 (Highly Productive)'
                : rating === 3
                ? '3/5 (Steady Progress)'
                : 'Needs Re-calibration'}
            </span>
          </div>
        </div>

        {/* Wins */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Key Wins & Milestones Achieved</span>
          </label>
          <textarea
            rows={2}
            required
            placeholder="e.g., Completed the Raft leader election lab and reviewed the systems paper without tab switching."
            value={wins}
            onChange={(e) => setWins(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Blockers */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-red-400" />
            <span>Blockers & Distractions Encountered</span>
          </label>
          <textarea
            rows={2}
            placeholder="e.g., Got stuck on a compiler bug for 40m, or got distracted after lunch."
            value={blockers}
            onChange={(e) => setBlockers(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Tomorrow's Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Adjustments & Primary Focus for Tomorrow</span>
          </label>
          <textarea
            rows={2}
            placeholder="e.g., Protect 09:00 - 11:00 for the Convex Optimization problem set before checking email."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setReviewModalOpen(false)}
            className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25"
          >
            Submit Daily Reflection
          </button>
        </div>
      </form>
    </Modal>
  );
};

