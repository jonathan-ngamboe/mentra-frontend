'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  FilterFn,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Profession } from '@/types/profession';
import { RIASEC_COLORS } from '@/constants/riasec';
import { RiasecKey, RiasecScores } from '@/types/riasec';
import { Dictionary } from '@/types/dictionary';
import { SupportedLocale } from '@/app/[lang]/dictionaries';
import { EvaluationModal } from './EvaluationModal';
import {
  Briefcase,
  Calendar,
  CalendarDays,
  Tag,
  ArrowUpDown,
  MoreVertical,
  Paintbrush,
  Info,
  ChevronsUpDown,
  CheckCircle,
} from 'lucide-react';

const RIASEC_KEYS: RiasecKey[] = ['R', 'I', 'A', 'S', 'E', 'C'];

type Props = {
  professions: Profession[];
  dictionary: Dictionary;
  lang: SupportedLocale;
};

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

const getDominantRiasec = (scores: Record<RiasecKey, number> | undefined): RiasecKey | null => {
  if (!scores) return null;
  let dominantKey: RiasecKey | null = null;
  let maxScore = -1;

  RIASEC_KEYS.forEach((key) => {
    const score = scores[key];
    if (typeof score === 'number' && score > maxScore) {
      maxScore = score;
      dominantKey = key;
    }
  });
  return maxScore > 0 ? dominantKey : null;
};

export const ProfessionTable = ({ professions, dictionary, lang }: Props) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedProfession, setSelectedProfession] = React.useState<Profession | null>(null);

  const handleSaveEvaluation = async (professionId: number, scores: Record<RiasecKey, number>) => {
    console.log('Sauvegarde pour', professionId, scores);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Ici, vous mettriez à jour l'état global ou re-fetcheriez les données si nécessaire
    // Pour l'exemple, on ne fait rien de plus
    // throw new Error("Simulated network error"); // Décommentez pour tester l'erreur
  };

  const openEvaluationModal = (profession: Profession) => {
    setSelectedProfession(profession);
    setIsModalOpen(true);
  };

  const openDetails = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const checkEvaluation = (id: number) => {
    return false;
  };

  const columns: ColumnDef<Profession>[] = React.useMemo(
    () => [
      {
        accessorKey: 'riasecScores',
        header: () => (
          <div className="flex items-center gap-1.5">
            <Paintbrush className="h-4 w-4" />
            {dictionary.common.riasecProfile}
          </div>
        ),
        cell: ({ row }) => {
          const scores = row.original.riasecScores?.[0];
          if (!scores) return <span className="text-muted-foreground text-xs">N/A</span>;

          const dominantKey = getDominantRiasec(scores);
          const dominantColor = dominantKey ? RIASEC_COLORS[dominantKey] : 'bg-gray-400';

          const sortedScores = RIASEC_KEYS.map((key) => ({ key, score: scores[key] ?? 0 }))
            .filter((item) => item.score > 0)
            .sort((a, b) => b.score - a.score);

          const topThree = sortedScores
            .slice(0, 3)
            .map((item) => item.key)
            .join('');

          return (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md font-medium text-xs cursor-pointer border hover:scale-105 transition-transform"
                  style={{ backgroundColor: dominantColor, color: '#fff' }}
                  aria-label={dictionary.professionsPage.showRiasecDetails}
                >
                  {topThree || '---'}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-3">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none text-sm">
                    {dictionary.riasec.riasecScores}
                  </h4>
                  {sortedScores.length > 0 ? (
                    <ul className="text-xs space-y-1">
                      {sortedScores.map(({ key, score }) => (
                        <li key={key} className="flex justify-between items-center">
                          <span>
                            <span
                              className="mr-1.5 inline-block h-2 w-2 rounded-full"
                              style={{ backgroundColor: RIASEC_COLORS[key] ?? '#ccc' }}
                            ></span>
                            {dictionary.riasec.dimensions[key as RiasecKey].name}
                          </span>
                          <span className="font-semibold">{score}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {dictionary.professionsPage.noScores}
                    </p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;

          const riasecData = row.getValue(columnId) as RiasecScores[] | undefined;
          if (!riasecData || riasecData.length === 0) return false;

          const scores = riasecData[0];
          const dominantKey = getDominantRiasec(scores);
          return dominantKey === filterValue;
        },
        enableSorting: false,
      },
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {dictionary.common.name}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
      },
      {
        accessorKey: 'option',
        header: () => (
          <div className="flex items-center gap-1.5">
            <Tag className="h-4 w-4" />
            {dictionary.common.option}
          </div>
        ),
        cell: ({ row }) =>
          row.original.option ? (
            <span className="truncate">{row.original.option}</span>
          ) : (
            <span className="text-muted-foreground">-</span>
          ),
      },
      {
        accessorKey: 'activitySector',
        header: () => (
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4" />
            {dictionary.common.activitySector}
          </div>
        ),
        cell: ({ row }) =>
          row.original.activitySector ? (
            <span className="truncate">{row.original.activitySector}</span>
          ) : (
            <span className="text-muted-foreground">-</span>
          ),
      },
      {
        accessorKey: 'duration',
        header: () => (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {dictionary.common.duration}
          </div>
        ),
        cell: ({ row }) => {
          const { minDuration, maxDuration } = row.original;
          if (minDuration !== null && maxDuration !== null && minDuration !== maxDuration) {
            return (
              <span className="truncate">{`${minDuration} - ${maxDuration} ${dictionary.common.years}`}</span>
            );
          }
          if (minDuration !== null) {
            return <span className="truncate">{`${minDuration} ${dictionary.common.years}`}</span>;
          }
          if (maxDuration !== null) {
            return <span className="truncate">{`${maxDuration} ${dictionary.common.years}`}</span>;
          }
          return <span className="text-muted-foreground">-</span>;
        },
        enableSorting: false,
      },
      {
        accessorKey: 'effectiveDate',
        header: () => (
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {dictionary.common.effectiveDate}
          </div>
        ),
        cell: ({ row }) =>
          row.original.effectiveDate ? (
            <span>{new Date(row.original.effectiveDate).toLocaleDateString(lang)}</span>
          ) : (
            <span className="text-muted-foreground">-</span>
          ),
      },
      {
        accessorKey: 'description',
        header: () => (
          <div className="flex items-center gap-1.5">
            <Info className="h-4 w-4" />
            {dictionary.common.description}
          </div>
        ),
        cell: ({ row }) =>
          row.original.description ? (
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start p-1 h-auto text-left text-muted-foreground hover:text-foreground"
                >
                  <ChevronsUpDown className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">{dictionary.common.viewMore}</span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <p className="text-xs text-muted-foreground">{row.original.description}</p>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <span className="text-muted-foreground text-xs">-</span>
          ),
        enableSorting: false,
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const profession = row.original;
          const isEvaluated = checkEvaluation(profession.id);
          const sourceResource = profession.resources?.find(
            (resource) => resource.name === 'Source'
          );

          return (
            <div className="flex items-center justify-end">
              {isEvaluated && (
                <CheckCircle
                  className="h-4 w-4 text-green-500 mr-2"
                  aria-label={dictionary.professionsPage.alreadyEvaluated}
                />
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                    <span className="sr-only">{dictionary.common.openMenu}</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{dictionary.common.actions}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {sourceResource && (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => sourceResource.href && openDetails(sourceResource.href)}
                    >
                      {dictionary.professionsPage.details}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => openEvaluationModal(profession)}
                  >
                    {dictionary.professionsPage.evaluate}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [dictionary, lang]
  );

  const table = useReactTable({
    data: professions,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleRiasecFilterChange = (value: string) => {
    const currentFilters = columnFilters.filter((f) => f.id !== 'riasecScores');
    if (value && value !== 'all') {
      setColumnFilters([...currentFilters, { id: 'riasecScores', value: value }]);
    } else {
      setColumnFilters(currentFilters);
    }
  };

  const currentRiasecFilter =
    (columnFilters.find((f) => f.id === 'riasecScores')?.value as string) ?? 'all';

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <Input
          placeholder={`${dictionary.common.searchByName}...`}
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm w-full sm:w-auto bg-card"
        />
        <div className="flex items-center gap-2">
          <Label htmlFor="riasec-filter" className="text-sm font-medium whitespace-nowrap">
            {dictionary.common.filterByRiasec}:
          </Label>
          <Select value={currentRiasecFilter} onValueChange={handleRiasecFilterChange}>
            <SelectTrigger id="riasec-filter" className="w-[180px] bg-card cursor-pointer">
              <SelectValue placeholder={dictionary.common.selectType} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{dictionary.common.allTypes}</SelectItem>
              {RIASEC_KEYS.map((key) => (
                <SelectItem key={key} value={key} className="cursor-pointer">
                  {dictionary.riasec.dimensions[key as RiasecKey].name} ({key})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                  // data-state={checkUserEvaluation(row.original.id) ? "evaluated" : undefined} // Placeholder pour style "évalué"
                  className="hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {dictionary.common.noResults}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <span className="text-sm text-muted-foreground">
          {dictionary.common.page} {table.getState().pagination.pageIndex + 1} /{' '}
          {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {dictionary.common.previous}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {dictionary.common.next}
        </Button>
      </div>

      {/* Evaluation Modal */}
      <EvaluationModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        profession={selectedProfession}
        dictionary={dictionary}
        onSave={handleSaveEvaluation}
      />
    </div>
  );
};
