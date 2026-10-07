import React from "react";
import Link from "next/link";
import { CampusEvent } from "@/types/models";
import { getEventStatus } from "@/lib/events";
import { formatDhakaDateTime, formatDhakaTime } from "@/lib/date";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";

export interface EventCardProps {
  event: CampusEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const status = getEventStatus(event);
  const seatsLeft = Math.max(0, event.capacity - event.registeredCount);

  const statusBadge = {
    today: <Badge variant="gold">Today</Badge>,
    upcoming: <Badge variant="success">Upcoming</Badge>,
    full: <Badge variant="warning">Full / Waitlist</Badge>,
    closed: <Badge variant="neutral">Closed</Badge>,
    past: <Badge variant="neutral">Past</Badge>,
  }[status];

  return (
    <Card variant="interactive" className="h-full flex flex-col justify-between group">
      <div>
        {/* Header badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {statusBadge}
            <Badge variant="default">{event.type}</Badge>
            {event.source === "demo" && <DemoBadge size="sm" />}
          </div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
            {event.clubName.split("(")[0].trim()}
          </span>
        </div>

        {/* Title */}
        <Link href={`/events/${event.id}`}>
          <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-campus-navy-700 dark:group-hover:text-campus-gold-400 transition leading-snug">
            {event.title}
          </h3>
        </Link>

        {/* Short description */}
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        {/* Meta details */}
        <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-campus-gold-600 dark:text-campus-gold-400 shrink-0" />
            <span>{formatDhakaDateTime(event.startAt)}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              {seatsLeft > 0 ? (
                <strong className="text-emerald-600 dark:text-emerald-400">{seatsLeft} seats left</strong>
              ) : (
                <strong className="text-amber-600 dark:text-amber-400">Capacity reached</strong>
              )}{" "}
              <span className="text-slate-400">({event.registeredCount}/{event.capacity})</span>
            </span>
          </div>
        </div>
      </div>

      {/* Footer action link */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">Dhaka Time</span>
        <Link
          href={`/events/${event.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-campus-navy-800 dark:text-campus-gold-400 hover:underline group-hover:translate-x-0.5 transition-transform"
        >
          <span>View Event</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
};
