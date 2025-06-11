
import React from 'react';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

interface WorkingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

interface WorkingHoursEditorProps {
  workingHours: WorkingHours;
  onChange: (hours: WorkingHours) => void;
}

const DAYS = [
  'monday',
  'tuesday', 
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
] as const;

const DAY_LABELS = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday', 
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
} as const;

const WorkingHoursEditor = ({ workingHours, onChange }: WorkingHoursEditorProps) => {
  const updateDay = (day: keyof WorkingHours, field: keyof DayHours, value: string | boolean) => {
    const newHours = {
      ...workingHours,
      [day]: {
        ...workingHours[day],
        [field]: value
      }
    };
    onChange(newHours);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-300 block">Working Hours</label>
      
      <div className="space-y-3">
        {DAYS.map(day => {
          const dayHours = workingHours[day] || { open: '09:00', close: '18:00', closed: false };
          
          return (
            <div key={day} className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
              <div className="w-20">
                <span className="text-sm text-gray-300">{DAY_LABELS[day]}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={dayHours.closed}
                  onCheckedChange={(checked) => updateDay(day, 'closed', checked)}
                />
                <span className="text-xs text-gray-400">Closed</span>
              </div>
              
              {!dayHours.closed && (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="time"
                    value={dayHours.open}
                    onChange={(e) => updateDay(day, 'open', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white text-sm"
                  />
                  <span className="text-gray-400 text-sm">to</span>
                  <Input
                    type="time"
                    value={dayHours.close}
                    onChange={(e) => updateDay(day, 'close', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white text-sm"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkingHoursEditor;
