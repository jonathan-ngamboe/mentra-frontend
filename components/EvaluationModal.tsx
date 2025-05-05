import * as React from 'react';
import { CSSProperties } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Profession } from '@/types/profession';
import { Dictionary } from '@/types/dictionary';
import { RiasecKey, RiasecScores } from '@/types/riasec';
import { RIASEC_COLORS } from '@/constants/riasec';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const RIASEC_KEYS: RiasecKey[] = ['R', 'I', 'A', 'S', 'E', 'C'];

interface RadarDataPoint {
  subject: RiasecKey;
  value: number;
  fullMark: number;
  fullName?: string;
}

type EvaluationModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  profession: Profession | null;
  dictionary: Dictionary;
  onSave: (professionId: number, scores: Record<RiasecKey, number>) => Promise<void>;
};

export function EvaluationModal({
  isOpen,
  onOpenChange,
  profession,
  dictionary,
  onSave,
}: EvaluationModalProps) {
  const [scores, setScores] = React.useState<Record<RiasecKey, number>>({
    R: 0,
    I: 0,
    A: 0,
    S: 0,
    E: 0,
    C: 0,
  });
  const [isSaving, setIsSaving] = React.useState(false);

  const SLIDER_MAX_VALUE = 40;

  React.useEffect(() => {
    const initialScores: Record<RiasecKey, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const existingScores: RiasecScores | Record<RiasecKey, number> | undefined =
      profession?.riasecScores?.[0];

    if (existingScores) {
      RIASEC_KEYS.forEach((key) => {
        if (key in existingScores && typeof existingScores[key] === 'number') {
          initialScores[key] = Math.min(existingScores[key] as number, SLIDER_MAX_VALUE);
        }
      });
    }
    setScores(initialScores);
  }, [profession]);

  const handleSliderChange = (key: RiasecKey, value: number[]) => {
    setScores((prevScores) => ({
      ...prevScores,
      [key]: value[0], 
    }));
  };

  const handleSaveClick = async () => {
    if (!profession) return;
    setIsSaving(true);
    try {
      await onSave(profession.id, scores);
      toast.success(dictionary.professionsPage.evaluationSaved);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save evaluation:', error);
      toast.error(dictionary.professionsPage.evaluationError);
    } finally {
      setIsSaving(false);
    }
  };

  const radarData: RadarDataPoint[] = RIASEC_KEYS.map((key) => ({
    subject: key,
    value: scores[key] ?? 0,
    fullMark: SLIDER_MAX_VALUE,
    fullName: dictionary.riasec.dimensions[key as RiasecKey].name,
  }));

  const chartConfig: ChartConfig = {
    value: {
      label: dictionary.common.score || 'Score',
      color: 'hsl(var(--primary))',
    },
    ...RIASEC_KEYS.reduce(
      (acc, key) => {
        const label = dictionary.riasec.dimensions[key as RiasecKey].name;
        const color = RIASEC_COLORS[key] || '#8884d8';
        acc[key] = { label, color };
        return acc;
      },
      {} as Record<RiasecKey, { label: string; color: string }>
    ),
  };

  if (!profession) return null;

  const primaryColor = 'hsl(var(--primary))';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] md:max-w-[750px] lg:max-w-[850px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {dictionary.professionsPage.evaluation}: {profession.name}
          </DialogTitle>
          <DialogDescription>{dictionary.professionsPage.evaluateDescription}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 py-4 overflow-y-auto pr-2">
          <div className="space-y-5 content-center pl-2">
            {RIASEC_KEYS.map((key) => (
              <div key={key} className="grid gap-2.5">
                <Label htmlFor={`slider-${key}`} className="flex items-center font-medium">
                  <span
                    className="mr-2 inline-block h-3 w-3 rounded-full border border-muted-foreground/30"
                    style={{ backgroundColor: RIASEC_COLORS[key] ?? '#ccc' }}
                  ></span>
                  {dictionary.riasec.dimensions[key as RiasecKey].name} ({scores[key] ?? 0})
                </Label>
                <Slider
                  id={`slider-${key}`}
                  min={0}
                  max={SLIDER_MAX_VALUE}
                  step={1}
                  value={[scores[key] ?? 0]}
                  onValueChange={(value) => handleSliderChange(key, value)}
                  className="w-full cursor-pointer"
                  style={
                    {
                      '--slider-thumb-color': RIASEC_COLORS[key] ?? primaryColor,
                    } as CSSProperties
                  }
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center min-h-[300px] md:min-h-[350px] rounded-md p-2">
            <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-lg">
              <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 10, left: 30 }}>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      className="w-[160px]"
                      labelFormatter={(label, payload) => payload[0]?.payload?.fullName || label}
                      formatter={(value, name, props) => `${value} / ${props.payload.fullMark}`}
                    />
                  }
                />
                <PolarGrid gridType="polygon" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={(props) => {
                    const { x, y, payload } = props;
                    // Safely access chartConfig with null coalescing
                    const color =
                      chartConfig[payload.value as RiasecKey]?.color ??
                      chartConfig.value?.color ??
                      primaryColor;
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text
                          x={0}
                          y={0}
                          dy={4}
                          textAnchor="middle"
                          fill={color}
                          fontSize="13"
                          fontWeight="medium"
                        >
                          {payload.value}
                        </text>
                      </g>
                    );
                  }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, SLIDER_MAX_VALUE]}
                  axisLine={false}
                  tick={false}
                />
                <Radar
                  name={dictionary.common.score}
                  dataKey="value"
                  stroke={chartConfig.value?.color ?? primaryColor}
                  fill={chartConfig.value?.color ?? primaryColor}
                  fillOpacity={0.4}
                  dot={{
                    r: 3,
                    fillOpacity: 1,
                  }}
                />
              </RadarChart>
            </ChartContainer>
          </div>
        </div>
        <DialogFooter className="mt-auto pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            {dictionary.common.cancel}
          </Button>
          <Button onClick={handleSaveClick} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {dictionary.common.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
