"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { INITIAL_CLUBS } from "@/data/initialClubs";
import { fetchEventById, saveEvent } from "@/lib/events";
import { CampusEvent, EventType, RecordSource } from "@/types/models";
import { ArrowLeft, Save } from "lucide-react";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [title, setTitle] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [description, setDescription] = useState("");
  const [clubId, setClubId] = useState(INITIAL_CLUBS[0].id);
  const [type, setType] = useState<EventType>("workshop");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState(50);
  const [source, setSource] = useState<RecordSource>("demo");
  const [eventData, setEventData] = useState<CampusEvent | null>(null);

  useEffect(() => {
    async function load() {
      setFetching(true);
      const data = await fetchEventById(eventId);
      if (data) {
        setEventData(data);
        setTitle(data.title);
        setTitleBn(data.title_bn || "");
        setDescription(data.description);
        setClubId(data.clubId);
        setType(data.type);
        setLocation(data.location);
        setCapacity(data.capacity);
        setSource(data.source);
      }
      setFetching(false);
    }
    if (eventId) load();
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) {
      error("Please complete all required fields.");
      return;
    }

    setLoading(true);
    try {
      const selectedClubObj = INITIAL_CLUBS.find((c) => c.id === clubId);

      await saveEvent({
        id: eventId,
        title: title.trim(),
        title_bn: titleBn.trim() || undefined,
        description: description.trim(),
        clubId,
        clubName: selectedClubObj?.name || eventData?.clubName || "City University Club",
        type,
        location: location.trim(),
        capacity: Number(capacity),
        source,
      });

      success("Event details updated!");
      router.push(`/events/${eventId}`);
    } catch (err: any) {
      console.error("Update event error:", err);
      error(err.message || "Failed to update event.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <ProtectedRoute allowedRoles={["club_admin", "admin"]}>
        <AppShell>
          <div className="max-w-3xl mx-auto py-12 text-center text-xs text-slate-500">
            Loading event details...
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["club_admin", "admin"]}>
      <AppShell>
        <div className="max-w-3xl mx-auto pb-12">
          <Link
            href={`/events/${eventId}`}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel and return</span>
          </Link>

          <PageHeader
            title="Edit Campus Event"
            subtitle={`Updating specifications for "${eventData?.title}"`}
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <h2 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
                Event Specifications
              </h2>
              <div className="space-y-4">
                <Input
                  label="Event Title *"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <Input
                  label="Title (Bangla)"
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Organizing Club *"
                    value={clubId}
                    onChange={(e) => setClubId(e.target.value)}
                  >
                    {INITIAL_CLUBS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} – {c.name.split("(")[0]}
                      </option>
                    ))}
                  </Select>

                  <Select
                    label="Event Category *"
                    value={type}
                    onChange={(e) => setType(e.target.value as EventType)}
                  >
                    <option value="workshop">Workshop</option>
                    <option value="contest">Contest / Hackathon</option>
                    <option value="seminar">Seminar</option>
                    <option value="cultural">Cultural</option>
                    <option value="sports">Sports</option>
                    <option value="general">General</option>
                  </Select>
                </div>

                <Textarea
                  label="Description *"
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Physical Location *"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <Input
                    label="Seat Capacity *"
                    type="number"
                    min={1}
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Select
                    label="Data Origin (Rule 3) *"
                    value={source}
                    onChange={(e) => setSource(e.target.value as RecordSource)}
                  >
                    <option value="demo">Demo Data (Hackathon Simulation)</option>
                    <option value="official">Official City University Event</option>
                  </Select>
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-3">
              <Link href={`/events/${eventId}`}>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button variant="gold" type="submit" isLoading={loading} className="gap-2">
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </Button>
            </div>
          </form>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
