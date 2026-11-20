import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { AvailabilityResult } from '@/lib/availability';
import { describeAvailability } from '@/lib/availabilityMessage';

interface ResultCardProps {
  result: AvailabilityResult | null;
  roomName: string;
}

export default function ResultCard({ result, roomName }: ResultCardProps) {
  if (!result) return null;

  const message = describeAvailability(result, roomName);

  const config = {
    available: {
      icon: CheckCircle2,
      bg: 'bg-green-50',
      ring: 'ring-green-200',
      iconColor: 'text-green-600',
      title: 'Available',
      titleColor: 'text-green-800',
      bodyColor: 'text-green-700',
    },
    unavailable: {
      icon: XCircle,
      bg: 'bg-red-50',
      ring: 'ring-red-200',
      iconColor: 'text-red-600',
      title: 'Unavailable',
      titleColor: 'text-red-800',
      bodyColor: 'text-red-700',
    },
    invalid: {
      icon: AlertCircle,
      bg: 'bg-amber-50',
      ring: 'ring-amber-200',
      iconColor: 'text-amber-600',
      title: 'Invalid Input',
      titleColor: 'text-amber-800',
      bodyColor: 'text-amber-700',
    },
  } as const;

  const c = config[result.status];
  const Icon = c.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`flex items-start gap-3 rounded-2xl ${c.bg} p-5 ring-1 ${c.ring} animate-[fadeIn_0.2s_ease-out]`}
    >
      <Icon className={`h-6 w-6 shrink-0 ${c.iconColor}`} />
      <div className="min-w-0">
        <p className={`text-base font-bold ${c.titleColor}`}>{c.title}</p>
        <p className={`mt-0.5 text-sm ${c.bodyColor}`}>{message}</p>
      </div>
    </div>
  );
}
