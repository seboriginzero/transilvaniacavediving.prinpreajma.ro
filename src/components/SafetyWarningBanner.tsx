import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface SafetyWarningBannerProps {
  warnings: string[];
  title?: string;
}

export function SafetyWarningBanner({
  warnings,
  title = 'Reguli de Siguranță, Echipament Obligatoriu și Regim de Protecție',
}: SafetyWarningBannerProps) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <aside
      aria-label="Avertisment de siguranță"
      className="my-6 rounded-2xl border-l-4 border-safety-500 bg-cavern-800/95 p-5 shadow-lg ring-1 ring-safety-500/30"
    >
      <div className="flex items-start gap-3.5">
        <div className="rounded-lg bg-safety-500/20 p-2 text-safety-400 shrink-0">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h2 className="text-base font-bold text-safety-400">{title}</h2>
          <ul className="space-y-2 text-sm leading-relaxed text-limestone-100 list-disc pl-4">
            {warnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

