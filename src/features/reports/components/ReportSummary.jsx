import React, { useState } from 'react';
import { Database, Inbox, CheckCircle2, Layers, ArrowUpRight } from 'lucide-react';
import { ROADMAP_PHASES } from '../../../constants/index.js';
import Card, { CardHeader, CardBody } from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

export function ReportSummary({ className = '' }) {
  const [activeTab, setActiveTab] = useState('status'); // 'status' | 'schema' | 'roadmap'

  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Header with Tabs */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Database className="w-3.5 h-3.5" aria-hidden="true" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">
              Reports & Coordination Hub
            </h4>
            <p className="text-[11px] text-slate-500">
              Community report data pipeline
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div
          role="tablist"
          aria-label="Summary views"
          className="flex items-center p-0.5 bg-slate-200/70 rounded-lg text-xs"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'status'}
            onClick={() => setActiveTab('status')}
            className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
              activeTab === 'status'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Feed Status
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'schema'}
            onClick={() => setActiveTab('schema')}
            className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
              activeTab === 'schema'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Data Contract
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'roadmap'}
            onClick={() => setActiveTab('roadmap')}
            className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
              activeTab === 'roadmap'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Milestones
          </button>
        </div>
      </CardHeader>

      <CardBody className="p-4 sm:p-5">
        {/* Tab 1: Live Feed Status (Purposeful Empty State) */}
        {activeTab === 'status' && (
          <div className="py-6 text-center max-w-md mx-auto">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3 border border-slate-200">
              <Inbox className="w-6 h-6" aria-hidden="true" />
            </div>
            <h5 className="text-sm font-bold text-slate-900 mb-1">
              No Community Reports Recorded Yet
            </h5>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Live reports will appear in this feed once Supabase database
              synchronization and realtime listeners are connected in Phase 3.
              No synthetic or simulated records are shown.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              Service layer and query interfaces ready
            </div>
          </div>
        )}

        {/* Tab 2: Relational Data Schema Contract */}
        {activeTab === 'schema' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800">
                PostgreSQL Schema: <code className="font-mono text-emerald-700">trash_reports</code>
              </span>
              <Badge variant="info">Target: Supabase</Badge>
            </div>

            <div className="bg-slate-900 text-slate-100 rounded-xl p-3.5 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
              <div className="text-emerald-400 font-semibold mb-1">// Relational table contract</div>
              <div><span className="text-sky-300">CREATE TABLE</span> trash_reports (</div>
              <div className="pl-4">id <span className="text-amber-300">uuid PRIMARY KEY DEFAULT gen_random_uuid()</span>,</div>
              <div className="pl-4">lat <span className="text-amber-300">double precision NOT NULL</span>,</div>
              <div className="pl-4">lng <span className="text-amber-300">double precision NOT NULL</span>,</div>
              <div className="pl-4">severity <span className="text-amber-300">smallint CHECK (severity &gt;= 1 AND severity &lt;= 5)</span>,</div>
              <div className="pl-4">description <span className="text-amber-300">text</span>,</div>
              <div className="pl-4">status <span className="text-amber-300">text DEFAULT 'reported'</span>,</div>
              <div className="pl-4">created_at <span className="text-amber-300">timestamptz DEFAULT now()</span></div>
              <div>);</div>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal">
              Directly aligned with proposal specifications. Public anonymous pin drops
              streamline user interaction without initial authentication overhead.
            </p>
          </div>
        )}

        {/* Tab 3: 5-Phase Roadmap */}
        {activeTab === 'roadmap' && (
          <div className="space-y-2.5">
            {ROADMAP_PHASES.map((phase) => (
              <div
                key={phase.phase}
                className={`p-2.5 rounded-lg border text-xs flex items-start gap-3 transition ${
                  phase.active
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 opacity-80'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                    phase.active
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {phase.phase}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-slate-900">
                      {phase.title}
                    </span>
                    {phase.active && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-700 text-white uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 leading-normal text-[11px]">
                    {phase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default ReportSummary;
