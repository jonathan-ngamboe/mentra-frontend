'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { InfoIcon, ExternalLinkIcon, BarChart3Icon, RadarIcon } from 'lucide-react';
import { RiasecResultsProps, RiasecKey } from '@/types/riasec';

export function RiasecResults({ profile, professionMatches, dictionary }: RiasecResultsProps) {
  const [activeTab, setActiveTab] = useState('radar');

  // Convert the profile object to an array of objects for easier sorting and display
  const profileArray = (Object.entries(profile) as [RiasecKey, number][]).map(
    ([dimension, score]) => ({
      dimension,
      score,
      label: dictionary.services.careerMatching.dimensions[dimension].name,
      description: dictionary.services.careerMatching.dimensions[dimension].description,
    })
  );

  // Sort the profile array by score in descending order
  const sortedProfile = [...profileArray].sort((a, b) => b.score - a.score);

  // Get the RIASEC code (the top 3 dimensions)
  const riasecCode = sortedProfile
    .slice(0, 3)
    .map((item) => item.dimension)
    .join('');

  // Calculate the maximum score for the scale
  const maxScore = Math.max(...profileArray.map((item) => item.score), 40);

  // Prepare the data for the radar chart
  const radarData = [
    {
      subject: 'R',
      fullName: dictionary.services.careerMatching.dimensions.R.name,
      description: dictionary.services.careerMatching.dimensions.R.description,
      value: profile.R,
      fullMark: maxScore,
    },
    {
      subject: 'I',
      fullName: dictionary.services.careerMatching.dimensions.I.name,
      description: dictionary.services.careerMatching.dimensions.I.description,
      value: profile.I,
      fullMark: maxScore,
    },
    {
      subject: 'A',
      fullName: dictionary.services.careerMatching.dimensions.A.name,
      description: dictionary.services.careerMatching.dimensions.A.description,
      value: profile.A,
      fullMark: maxScore,
    },
    {
      subject: 'S',
      fullName: dictionary.services.careerMatching.dimensions.S.name,
      description: dictionary.services.careerMatching.dimensions.S.description,
      value: profile.S,
      fullMark: maxScore,
    },
    {
      subject: 'E',
      fullName: dictionary.services.careerMatching.dimensions.E.name,
      description: dictionary.services.careerMatching.dimensions.E.description,
      value: profile.E,
      fullMark: maxScore,
    },
    {
      subject: 'C',
      fullName: dictionary.services.careerMatching.dimensions.C.name,
      description: dictionary.services.careerMatching.dimensions.C.description,
      value: profile.C,
      fullMark: maxScore,
    },
  ];

  // Graph configuration
  const chartConfig = {
    value: {
      label: 'Score',
      color: 'hsl(var(--primary))',
    },
  } as ChartConfig;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                {dictionary.services.careerMatching.results.title}
              </CardTitle>
              <CardDescription>
                {dictionary.services.careerMatching.results.description}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="text-lg px-3 py-1 font-bold self-start sm:self-auto"
            >
              {riasecCode}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-[200px] grid-cols-2 mb-6">
              <TabsTrigger value="radar" className="flex items-center gap-1 cursor-pointer">
                <RadarIcon className="h-4 w-4" />
                <span>{dictionary.common.chart}</span>
              </TabsTrigger>
              <TabsTrigger value="grid" className="flex items-center gap-1 cursor-pointer">
                <BarChart3Icon className="h-4 w-4" />
                <span>{dictionary.common.grid}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="radar" className="mt-0">
              <div className="flex flex-col items-center">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square w-full max-w-md"
                >
                  <RadarChart data={radarData} outerRadius="80%">
                    <PolarGrid gridType="polygon" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={(props) => {
                        const { x, y, payload } = props;
                        return (
                          <g transform={`translate(${x},${y})`}>
                            <text
                              x={0}
                              y={0}
                              dy={4}
                              textAnchor="middle"
                              fill="currentColor"
                              fontSize="14"
                              fontWeight="bold"
                            >
                              {payload.value}
                            </text>
                          </g>
                        );
                      }}
                    />
                    <PolarRadiusAxis domain={[0, maxScore]} axisLine={false} tick={false} />
                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                      dot={{
                        r: 4,
                        fill: 'hsl(var(--primary))',
                        fillOpacity: 1,
                        strokeWidth: 2,
                        stroke: 'white',
                      }}
                    />
                    <ChartTooltip
                      content={(props) => {
                        const { payload } = props;
                        if (!payload || payload.length === 0) return null;

                        const data = payload[0]?.payload;
                        return (
                          <div className="bg-background border rounded-md shadow-md p-2">
                            <div className="space-y-1">
                              <p className="text-sm font-bold">{data.fullName}</p>
                              <div className="flex items-center gap-1.5 text-primary rounded-full px-2.5 py-1 text-xs font-medium">
                                <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                                {dictionary.common.score}:{' '}
                                <span className="font-bold">{data.value}</span>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">{data.description}</div>
                          </div>
                        );
                      }}
                    />
                  </RadarChart>
                </ChartContainer>

                <div className="mt-4 text-sm text-muted-foreground text-center max-w-md">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-center gap-1 cursor-help">
                          <InfoIcon className="h-4 w-4" />
                          <span>{dictionary.services.careerMatching.whatIsRiasec}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{dictionary.services.careerMatching.riasecDescription}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="grid" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {sortedProfile.map(({ description, score, label }) => (
                  <Card key={label} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-bold">{label}</CardTitle>
                        <Badge variant="outline">{score}</Badge>
                      </div>
                      <CardDescription className="line-clamp-8">{description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <Progress value={(score / maxScore) * 100} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {dictionary.services.careerMatching.results.topMatches}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        {dictionary.services.careerMatching.results.matchesDescription}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h3>
            </div>

            {professionMatches && professionMatches.length > 0 ? (
              <div className="space-y-3">
                {professionMatches.slice(0, 10).map((match) => (
                  <div
                    key={match.id}
                    className="p-3 border rounded-md flex justify-between items-center hover:bg-muted/50 transition-colors"
                  >
                    <div className="font-medium">{match.name}</div>
                    <div className="flex items-center gap-3">
                      <Progress value={match.correlation * 100} className="w-24 h-2" />
                      <div className="text-sm font-medium min-w-[60px] text-right">
                        {(match.correlation * 100).toFixed(0)}%
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLinkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-muted rounded-md text-center text-muted-foreground">
                <p>{dictionary.services.careerMatching.results.noMatches}</p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2 text-sm border-t pt-4">
          <div className="flex items-center gap-2 leading-none text-muted-foreground">
            {dictionary.services.careerMatching.results.footer}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
