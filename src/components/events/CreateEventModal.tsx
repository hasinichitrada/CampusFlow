import React, { useState } from 'react';
import { useEvents } from '../../context/EventContext';
import {
  Sparkles,
  X,
  Calendar,
  DollarSign,
  Users,
  Tag,
  Loader2,
  FileText,
  Lightbulb,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateEventModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { createEventPlan, isGenerating } = useEvents();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-10-25');
  const [eventType, setEventType] = useState('Technical Fest');
  const [budget, setBudget] = useState('$2,500');
  const [teamMembersInput, setTeamMembersInput] = useState('Alex Chen, Priya Sharma, Marcus Brody, Sarah Miller');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const eventTypeOptions = [
    'Technical Fest',
    'Hackathon',
    'Cultural Night',
    'Seminar & Workshop',
    'Career Fair & Networking',
    'Sports Meet',
    'Club Orientation',
  ];

  // Quick fill preset templates
  const applyPreset = (preset: 'fest' | 'hackathon' | 'seminar') => {
    if (preset === 'fest') {
      setTitle('QuantumTech 2026');
      setDate('2026-10-28');
      setEventType('Technical Fest');
      setBudget('$3,800');
      setTeamMembersInput('Alex Chen, Priya Sharma, Jordan Lee, Sarah Miller');
      setDescription(
        'We are organizing an annual technical fest for around 350 students on October 28. We need high-res posters, online registrations with QR check-in, 20 volunteers, main auditorium and lab booking, guest speaker mementos, lunch snack boxes, Dean certificates, and intensive social media promotions.'
      );
    } else if (preset === 'hackathon') {
      setTitle('CodeSprint 24H Collegiate Hackathon');
      setDate('2026-11-12');
      setEventType('Hackathon');
      setBudget('$4,500');
      setTeamMembersInput('David Kim, Elena Rostova, Marcus Brody, Alex Chen');
      setDescription(
        'A 24-hour hackathon for 180 developers building AI agents and hardware robotics. We need overnight campus venue permissions, power strips and network switches, midnight pizza catering, 6 industry mentors, judge evaluation rubrics, participant t-shirts, and $1,500 prize awards.'
      );
    } else {
      setTitle('AI in Healthcare Faculty Symposium');
      setDate('2026-11-20');
      setEventType('Seminar & Workshop');
      setBudget('$1,800');
      setTeamMembersInput('Sarah Miller, Priya Sharma, Jordan Lee');
      setDescription(
        'A one-day academic symposium featuring 3 guest keynote speakers from hospital research labs. We need lecture hall A acoustics, presentation slide clickers, high-tea cookies and coffee service, formal invitations to department heads, printed program schedules, and attendee attendance badges.'
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Please provide an event title.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please describe your event requirements for Gemini AI.');
      return;
    }

    const teamMembers = teamMembersInput
      .split(',')
      .map(m => m.trim())
      .filter(Boolean);

    try {
      await createEventPlan({
        title: title.trim(),
        date,
        eventType,
        budget: budget.trim() || undefined,
        teamMembers,
        description: description.trim(),
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with AI service. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-[#FAF9F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#4E785F] text-white flex items-center justify-center shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-stone-900">
                Plan New Campus Event
              </h2>
              <p className="text-xs text-stone-500">
                Describe your concept; Gemini AI structures tasks, deadlines, and blind spots.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Quick presets */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-semibold mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick fill realistic examples:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset('fest')}
                className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors cursor-pointer"
              >
                🚀 TechFest 2026
              </button>
              <button
                type="button"
                onClick={() => applyPreset('hackathon')}
                className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors cursor-pointer"
              >
                💻 24H Hackathon
              </button>
              <button
                type="button"
                onClick={() => applyPreset('seminar')}
                className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors cursor-pointer"
              >
                🎤 Faculty Symposium
              </button>
            </div>
          </div>

          {/* Event Title */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              Event Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., TechFest 2026 / Robotics Hackathon"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#4E785F]/30 bg-stone-50/40"
            />
          </div>

          {/* Date, Event Type, Budget Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                Event Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#4E785F]/30 bg-stone-50/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                Event Type
              </label>
              <select
                value={eventType}
                onChange={e => setEventType(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#4E785F]/30 bg-stone-50/40"
              >
                {eventTypeOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                Estimated Budget
              </label>
              <input
                type="text"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                placeholder="e.g. $3,000"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#4E785F]/30 bg-stone-50/40"
              />
            </div>
          </div>

          {/* Team Members */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              Team Members / Assignees (comma-separated)
            </label>
            <div className="relative">
              <input
                type="text"
                value={teamMembersInput}
                onChange={e => setTeamMembersInput(e.target.value)}
                placeholder="Alex Chen, Priya Sharma, Marcus Brody, Sarah Miller"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#4E785F]/30 bg-stone-50/40"
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Gemini will automatically assign tasks across these names and departments.
            </p>
          </div>

          {/* Most Important Field: Event Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                Event Description & Needs <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] font-semibold text-[#4E785F]">
                Main input for Gemini AI
              </span>
            </div>
            <textarea
              required
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="We are organizing a technical fest for around 300 students on October 15. We need posters, registrations, volunteers, venue setup, certificates, refreshments and social media promotion."
              className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#4E785F]/30 bg-stone-50/40 leading-relaxed"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4E785F] hover:bg-[#3D634C] text-white text-xs font-semibold shadow-sm hover:shadow transition-all disabled:opacity-60 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini is generating plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>✨ Generate Event Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
