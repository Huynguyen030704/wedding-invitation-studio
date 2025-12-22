import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: Date;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: 'Ngày', value: timeLeft.days },
    { label: 'Giờ', value: timeLeft.hours },
    { label: 'Phút', value: timeLeft.minutes },
    { label: 'Giây', value: timeLeft.seconds },
  ];

  return (
    <div className="flex justify-center gap-4 md:gap-8">
      {timeUnits.map((unit, index) => (
        <div
          key={unit.label}
          className="flex flex-col items-center opacity-0 animate-fade-in-up"
          style={{ animationDelay: `${index * 0.1 + 0.5}s`, animationFillMode: 'forwards' }}
        >
          <div className="relative">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-card rounded-lg shadow-lg flex items-center justify-center border border-gold/30 animate-pulse-glow">
              <span className="text-2xl md:text-3xl font-semibold text-foreground font-body">
                {unit.value.toString().padStart(2, '0')}
              </span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full opacity-60" />
          </div>
          <span className="mt-2 text-sm md:text-base text-muted-foreground font-body tracking-wider uppercase">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
