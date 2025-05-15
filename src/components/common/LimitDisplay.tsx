import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CardLimitDisplayProps {
  currentCount: number;
  title: string;
  maxLimit?: number;
}

export function LimitDisplay({ currentCount, title, maxLimit = 100 }: CardLimitDisplayProps) {
  // Calculate progress percentage for the progress bar
  const progressPercentage = Math.min((currentCount / maxLimit) * 100, 100);

  // Determine color based on progress
  let progressColor = 'bg-green-500';
  if (progressPercentage > 90) {
    progressColor = 'bg-red-500';
  } else if (progressPercentage > 70) {
    progressColor = 'bg-yellow-500';
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-col gap-1 w-full max-w-xs">
          <div className="flex  text-xs text-muted-foreground gap-2">
            <span>{title}</span>
            <span aria-live="polite">
              {currentCount}/{maxLimit}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${progressColor} transition-all duration-300 ease-in-out`}
              style={{ width: `${progressPercentage}%` }}
              role="progressbar"
              aria-valuenow={currentCount}
              aria-valuemin={0}
              aria-valuemax={maxLimit}
            />
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {currentCount === maxLimit ? 'Osiągnięto limit kart' : `Możesz dodać jeszcze ${maxLimit - currentCount} kart`}
      </TooltipContent>
    </Tooltip>
  );
}
