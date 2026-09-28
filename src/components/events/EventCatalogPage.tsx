import React from 'react';
import { useEvents } from '../../context/EventContext';
import {
  Calendar,
  Sparkles,
  Plus,
  Users,
  ChevronRight,
  TrendingUp,
  Tag,
  DollarSign,
} from 'lucide-react';

interface Props {
  onOpenCreate: () => void;
}

export const EventCatalogPage: React.FC<Props> = ({ onOpenCreate }) => {
  const { events, selectEventAndNavigate } = useEvents();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
            Campus Event Directory
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            All active collegiate initiatives, fests, hackathons, and symposiums.
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4E785F] hover:bg-[#3D634C] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Plan New Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map(event => (
          <div
            key={event.id}
            onClick={() => selectEventAndNavigate(event.id)}
            className="group p-6 rounded-3xl bg-white border border-stone-200/80 hover:border-stone-300 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EAE8E0] text-[#2F4A38]">
                  {event.eventType}
                </span>
                <span className="flex items-center gap-1 text-xs text-stone-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  {event.date}
                </span>
              </div>

              <h2 className="font-heading font-bold text-lg text-stone-900 group-hover:text-[#4E785F] transition-colors line-clamp-1">
                {event.title}
              </h2>

              <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                {event.summary || event.description}
              </p>

              {event.teamMembers && event.teamMembers.length > 0 && (
                <div className="mt-4 flex items-center gap-1.5 text-xs text-stone-500">
                  <Users className="w-3.5 h-3.5 text-stone-400" />
                  <span className="truncate">{event.teamMembers.slice(0, 3).join(', ')}{event.teamMembers.length > 3 ? ` +${event.teamMembers.length - 3} more` : ''}</span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">Readiness</span>
                <span className="font-bold text-[#4E785F]">{event.progress}%</span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4E785F] rounded-full transition-all duration-500"
                  style={{ width: `${event.progress}%` }}
                />
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-stone-500">
                <span>{event.tasks.length} tasks scheduled</span>
                <span className="inline-flex items-center gap-1 text-[#4E785F] font-semibold group-hover:translate-x-0.5 transition-transform">
                  Open plan <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
