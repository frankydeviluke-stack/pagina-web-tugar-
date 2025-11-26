import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalendarProps {
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
  blockedDays: number[];
  currentMonth: number;
  currentYear: number;
  onMonthChange: (month: number, year: number) => void;
}

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export default function Calendar({
  selectedDay,
  onSelectDay,
  blockedDays,
  currentMonth,
  currentYear,
  onMonthChange,
}: CalendarProps) {
  const getDaysInMonth = (month: number, year: number) => {
    if (month === 1 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) {
      return 29;
    }
    return DAYS_IN_MONTH[month];
  };

  const days = getDaysInMonth(currentMonth, currentYear);
  const daysArray = Array.from({ length: days }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      onMonthChange(11, currentYear - 1);
    } else {
      onMonthChange(currentMonth - 1, currentYear);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      onMonthChange(0, currentYear + 1);
    } else {
      onMonthChange(currentMonth + 1, currentYear);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevMonth}
          className="border-slate-600 hover:bg-slate-800"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <h3 className="text-lg font-semibold min-w-[180px] text-center">
          {MONTHS[currentMonth]} {currentYear}
        </h3>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          className="border-slate-600 hover:bg-slate-800"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sab"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-slate-400 py-2"
          >
            {day}
          </div>
        ))}

        {daysArray.map((day) => {
          const isBlocked = blockedDays.includes(day);
          const isSelected = selectedDay === day;

          return (
            <button
              key={day}
              onClick={() => !isBlocked && onSelectDay(day)}
              disabled={isBlocked}
              className={cn(
                "aspect-square rounded-lg font-semibold text-sm transition-all",
                isBlocked
                  ? "bg-slate-700/30 text-slate-500 cursor-not-allowed opacity-50"
                  : isSelected
                    ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg"
                    : "bg-slate-800/50 text-white hover:bg-slate-700 border border-slate-700 hover:border-blue-500"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-slate-700/30" />
          <span>Ocupado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-blue-500 to-cyan-500" />
          <span>Seleccionado</span>
        </div>
      </div>
    </div>
  );
}
