import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export const AppFooter: React.FC = () => {
  return (
    <footer className="mt-auto bg-campus-navy-950 text-white border-t border-campus-navy-800 text-xs py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* University Info */}
        <div className="md:col-span-2">
          <div className="flex items-center space-x-2.5 mb-3">
            <div className="h-7 w-7 rounded bg-campus-gold-500 text-campus-navy-950 flex items-center justify-center font-serif font-bold text-sm">
              CU
            </div>
            <span className="font-serif font-bold text-base text-slate-100">City University</span>
          </div>
          <p className="text-slate-400 leading-relaxed max-w-md">
            Khagan, Birulia, Savar, Dhaka-1340, Bangladesh.<br />
            Telephone: <strong className="text-slate-200">09643-234234</strong><br />
            Cell: +8801322917670, +8801322917671, +8801322917672, +8801322917673
          </p>
          <div className="mt-3 text-[11px] text-campus-gold-400">
            UGC Approved Private University • Medium of Instruction: English & Bangla
          </div>
        </div>

        {/* Official Links */}
        <div>
          <h4 className="font-semibold text-slate-200 uppercase tracking-wider mb-3">
            Official University Links
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <a
                href="https://cityuniversity.ac.bd"
                target="_blank"
                rel="noreferrer"
                className="hover:text-campus-gold-400 flex items-center gap-1.5 transition"
              >
                <span>cityuniversity.ac.bd</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://iems.cityuniversity.ac.bd/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-campus-gold-400 flex items-center gap-1.5 transition"
              >
                <span>iEMS Student Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://outlook.office.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-campus-gold-400 flex items-center gap-1.5 transition"
              >
                <span>Webmail (Office 365)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://cityuniversity.ac.bd/iqac"
                target="_blank"
                rel="noreferrer"
                className="hover:text-campus-gold-400 flex items-center gap-1.5 transition"
              >
                <span>IQAC Office</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>

        {/* Quick Portal Navigation */}
        <div>
          <h4 className="font-semibold text-slate-200 uppercase tracking-wider mb-3">
            CampusOS Quick Access
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <Link href="/events" className="hover:text-campus-gold-400 transition">
                Club & Event Feed
              </Link>
            </li>
            <li>
              <Link href="/bus" className="hover:text-campus-gold-400 transition">
                Live Bus Countdown
              </Link>
            </li>
            <li>
              <Link href="/resources" className="hover:text-campus-gold-400 transition">
                Academic Resources
              </Link>
            </li>
            <li>
              <Link href="/helpdesk" className="hover:text-campus-gold-400 transition">
                Helpdesk & Waivers
              </Link>
            </li>
            <li>
              <Link href="/complaints" className="hover:text-campus-gold-400 transition">
                Confidential Complaints
              </Link>
            </li>
            <li>
              <Link href="/judges" className="text-campus-gold-400 hover:underline font-semibold transition">
                Hackathon Judges Portal
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-campus-navy-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
        <div>
          &copy; {new Date().getFullYear()} City University CampusOS. Open Source MIT License.
        </div>
        <div>
          CPCCU Hackathon 2026 • Savar, Dhaka, Bangladesh
        </div>
      </div>
    </footer>
  );
};
