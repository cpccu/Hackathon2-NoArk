"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Users,
  Compass,
  Award,
} from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: {
    label: string;
    scores: Record<string, number>; // club code -> points
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What excites you most when you step away from the lecture whiteboard?",
    options: [
      { label: "Building full-stack web apps, algorithms, and solving LeetCode problems", scores: { CUCPC: 3, CURES: 1 } },
      { label: "Soldering microcontrollers, sensors, and building line-follower robots", scores: { CURC: 3 } },
      { label: "Debating national policy, ethics, and parliamentary rhetoric", scores: { CUDS: 3, CULC: 1 } },
      { label: "Performing music, theatre, poetry recitation, and cultural dance", scores: { CUCC: 3 } },
      { label: "Pitching business models, financial startups, and case competitions", scores: { CUBIC: 3, CUEC: 2 } },
      { label: "Playing football, cricket, table tennis, and campus sports tourneys", scores: { CUSC: 3 } },
    ],
  },
  {
    id: 2,
    question: "How do you prefer spending your Friday afternoon?",
    options: [
      { label: "In a 3-hour speed contest debugging logic bugs", scores: { CUCPC: 3 } },
      { label: "Testing robot chassis motor speeds in the campus corridors", scores: { CURC: 3 } },
      { label: "Debating current global affairs with teammates in the seminar room", scores: { CUDS: 3 } },
      { label: "Organizing social relief drives or blood donation campaigns", scores: { CUSSC: 3, CURF: 2 } },
      { label: "Taking documentary portraits and editing campus landscape photos", scores: { CUPS: 3 } },
    ],
  },
  {
    id: 3,
    question: "What primary skill do you want on your CV before graduation?",
    options: [
      { label: "High ICPC / NCPC rank and professional software architecture", scores: { CUCPC: 3, CURES: 2 } },
      { label: "Autonomous robotics, IoT sensors, and CAD mechanical modeling", scores: { CURC: 3 } },
      { label: "Persuasive public speaking, critical thinking, and negotiation", scores: { CUDS: 3, CULC: 2 } },
      { label: "Venture capital pitching, financial modeling, and marketing", scores: { CUEC: 3, CUBIC: 2 } },
      { label: "Field leadership, disaster response, and scout discipline", scores: { CURF: 3, CUSSC: 2 } },
    ],
  },
  {
    id: 4,
    question: "Which campus environment energizes you the most?",
    options: [
      { label: "A room full of laptops running VS Code and live contest scoreboards", scores: { CUCPC: 3 } },
      { label: "A podium facing an intense debating opposition and adjudicators", scores: { CUDS: 3 } },
      { label: "An auditorium stage with acoustic guitars and stage lights", scores: { CUCC: 3 } },
      { label: "A hardware lab with 3D printers and circuit breadboards", scores: { CURC: 3 } },
      { label: "Academic symposiums reviewing peer-reviewed IEEE papers", scores: { CURES: 3 } },
    ],
  },
  {
    id: 5,
    question: "Are you interested in representing City University at national tournaments?",
    options: [
      { label: "Yes, national programming contests (ICPC, Hackathons)", scores: { CUCPC: 3 } },
      { label: "Yes, national robotics olympiads and bot battles", scores: { CURC: 3 } },
      { label: "Yes, inter-university debating championships (English/Bangla)", scores: { CUDS: 3 } },
      { label: "Yes, national business case and Hult Prize competitions", scores: { CUBIC: 3, CUEC: 2 } },
      { label: "I prefer internal campus mentorship and peer community bonding", scores: { CUSSC: 2, CULC: 2, CUPS: 2 } },
    ],
  },
  {
    id: 6,
    question: "Which hobby would you love to master alongside your degree?",
    options: [
      { label: "Mastering advanced English public speaking and IELTS fluency", scores: { CULC: 3, CUDS: 1 } },
      { label: "DSLR composition, street photography, and color grading", scores: { CUPS: 3 } },
      { label: "Founding an early-stage tech startup or university venture", scores: { CUEC: 3, CUBIC: 2 } },
      { label: "Writing academic research proposals and conference submissions", scores: { CURES: 3 } },
      { label: "Rover scouting and outdoor survival expeditions", scores: { CURF: 3 } },
    ],
  },
];

const CLUB_META: Record<string, { name: string; desc: string; reason: string }> = {
  CUCPC: {
    name: "City University Computer Programming Club",
    desc: "The premier competitive programming and software development society on campus.",
    reason: "Your answers indicate high affinity for algorithmic problem solving, software engineering, and national contest tracks.",
  },
  CURC: {
    name: "City University Robotics Club",
    desc: "Pioneering autonomous robots, IoT drones, and line-follower hardware builds.",
    reason: "You thrive when bridging physical hardware, sensor engineering, and hands-on maker builds.",
  },
  CUDS: {
    name: "City University Debating Society",
    desc: "Championing parliamentary rhetoric, critical thinking, and public policy discourse.",
    reason: "You show natural flair for persuasion, articulate oration, and analytical counter-arguments.",
  },
  CUCC: {
    name: "City University Cultural Club",
    desc: "Vibrant hub for acoustic music, dramatic arts, dance, and university festivities.",
    reason: "Your creative energy aligns with stage performance, artistic expression, and campus celebrations.",
  },
  CUBIC: {
    name: "City University Business & Innovation Club",
    desc: "Fostering entrepreneurial mindsets, financial literacy, and corporate case competitions.",
    reason: "You demonstrate sharp strategic intuition for business modeling and corporate leadership.",
  },
  CUPS: {
    name: "City University Photography Society",
    desc: "Documenting campus life through visual storytelling, exhibitions, and photo walks.",
    reason: "You possess a visual creative eye for capturing authentic moments and visual media.",
  },
  CUSC: {
    name: "City University Sports Club",
    desc: "Organizing inter-department football, cricket, badminton, and chess championships.",
    reason: "Team camaraderie, athletic grit, and campus sporting glory resonate strongly with you.",
  },
  CULC: {
    name: "City University Language Club",
    desc: "Enhancing linguistic articulation, corporate English fluency, and public speaking.",
    reason: "You value cross-cultural communication, vocabulary mastery, and international fluency.",
  },
  CUSSC: {
    name: "City University Social Services Club",
    desc: "Community welfare, seasonal relief campaigns, and social responsibility initiatives.",
    reason: "You are driven by altruism, social impact, and uplifting underprivileged communities.",
  },
  CURF: {
    name: "City University Rover Scout Group",
    desc: "Character development, disciplined youth leadership, and campus emergency assistance.",
    reason: "Discipline, outdoor survival skills, and ethical fellowship match your personality.",
  },
  CURES: {
    name: "City University Research Society",
    desc: "Supporting undergraduate journal publications, research methodology, and symposiums.",
    reason: "You possess academic curiosity for peer-reviewed science and scholarly innovation.",
  },
  CUEC: {
    name: "City University Entrepreneurship Club",
    desc: "Connecting student founders with mentors, angel investors, and incubation pipelines.",
    reason: "You think like an innovator seeking to turn practical problems into sustainable ventures.",
  },
};

export default function ClubQuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState(false);
  const [followedClubs, setFollowedClubs] = useState<string[]>([]);

  function handleSelectOption(optIdx: number) {
    const opt = QUESTIONS[currentStep].options[optIdx];
    const newAnswers = [...answers, optIdx];
    setAnswers(newAnswers);

    // Update scores
    const newScores = { ...scores };
    Object.entries(opt.scores).forEach(([club, pts]) => {
      newScores[club] = (newScores[club] || 0) + pts;
    });
    setScores(newScores);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
    }
  }

  function handleReset() {
    setCurrentStep(0);
    setAnswers([]);
    setScores({});
    setCompleted(false);
  }

  function toggleFollow(clubCode: string) {
    setFollowedClubs((prev) =>
      prev.includes(clubCode) ? prev.filter((c) => c !== clubCode) : [...prev, clubCode]
    );
  }

  // Calculate sorted rankings
  const rankedClubs = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const currentQ = QUESTIONS[currentStep];

  return (
    <AppShell>
      <PageHeader
        title="Club Affinity Discovery Quiz"
        subtitle="Uncover the ideal campus societies matched to your unique ambitions, technical skills, and weekend passions."
        badge={
          <Badge variant="gold" size="md">
            Orientation Guide
          </Badge>
        }
      />

      <div className="max-w-3xl mx-auto mb-16">
        {!completed ? (
          <Card className="p-6 sm:p-8">
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-campus-navy-700 dark:text-campus-gold-400">
                Question {currentStep + 1} of {QUESTIONS.length}
              </span>
              <span className="text-xs text-slate-400">
                {Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}% Complete
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-6">
              <div
                className="bg-campus-navy-800 dark:bg-campus-gold-400 h-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-snug">
              {currentQ.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-campus-navy-600 dark:hover:border-campus-gold-500 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all group flex items-start justify-between gap-3"
                >
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-campus-navy-900 dark:group-hover:text-campus-gold-300">
                    {option.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-campus-navy-700 dark:group-hover:text-campus-gold-400 shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="p-6 sm:p-8 border-campus-gold-400 dark:border-campus-gold-800">
              <div className="text-center mb-8">
                <div className="inline-flex p-3 rounded-full bg-campus-gold-100 dark:bg-campus-gold-950 text-campus-gold-600 dark:text-campus-gold-400 mb-3">
                  <Award className="w-8 h-8" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Your Top Club Recommendations
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Based on transparent scoring across your technical preferences, creative goals, and teamwork style:
                </p>
              </div>

              {/* Recommendations */}
              <div className="space-y-4">
                {rankedClubs.map(([code, pts], rank) => {
                  const meta = CLUB_META[code] || {
                    name: code,
                    desc: "Official City University student society.",
                    reason: "Strong overlap with your selected preferences.",
                  };
                  const isFollowed = followedClubs.includes(code);

                  return (
                    <div
                      key={code}
                      className={`p-5 rounded-xl border transition ${
                        rank === 0
                          ? "bg-campus-gold-50/50 dark:bg-campus-gold-950/20 border-campus-gold-300 dark:border-campus-gold-800/60"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={rank === 0 ? "gold" : "default"} size="sm">
                              #{rank + 1} Best Match
                            </Badge>
                            <Badge variant="outline" size="sm">{code}</Badge>
                          </div>

                          <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                            {meta.name}
                          </h3>

                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            {meta.desc}
                          </p>

                          {/* AI Reason */}
                          <div className="mt-3 p-3 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-campus-gold-500 shrink-0 mt-0.5" />
                            <span><strong>Why this fits you:</strong> {meta.reason}</span>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                          <Button
                            variant={isFollowed ? "primary" : "outline"}
                            size="sm"
                            onClick={() => toggleFollow(code)}
                            className="text-xs flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isFollowed ? "Following" : "Follow Club"}</span>
                          </Button>
                          <Link href="/clubs">
                            <span className="text-xs text-campus-navy-700 dark:text-campus-gold-400 hover:underline">
                              Club Profile &rarr;
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Assessment</span>
                </Button>

                <Link href="/dashboard">
                  <Button variant="primary" size="sm" className="flex items-center gap-1.5 text-xs">
                    <span>Return to Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
