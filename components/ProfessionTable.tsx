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
} from '@tanstack/react-table';

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Profession } from '@/types/profession';
import { RIASEC_COLORS } from '@/constants/riasec';
import { RiasecKey } from '@/types/riasec';
import { Dictionary } from '@/types/dictionary';
import { SupportedLocale } from '@/app/[lang]/dictionaries';
import {
  Briefcase,
  Calendar,
  CalendarDays,
  Tag,
  ArrowUpDown,
  ChevronDown,
  MoreVertical,
  Paintbrush,
  Info,
} from 'lucide-react';

type Props = {
  professions: Profession[];
  dictionary: Dictionary;
  lang: SupportedLocale;
};

export const ProfessionTable = ({ professions, dictionary, lang }: Props) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const columns: ColumnDef<Profession>[] = [
    {
      accessorKey: 'riasecScores',
      header: () => (
        <div className="flex items-center gap-1.5">
          <Paintbrush className="h-4 w-4" />
          {dictionary.common.riasecProfile}
        </div>
      ),
      cell: ({ row }) => {
        let riasecDisplay: string = 'N/A';
        let backgroundColor = 'bg-gray-400';

        const firstScore = row.original.riasecScores?.[0];
        if (firstScore) {
          const riasecKeys: RiasecKey[] = ['R', 'I', 'A', 'S', 'E', 'C'];
          const validScores: Array<[RiasecKey, number]> = [];
          riasecKeys.forEach((key) => {
            const score = firstScore[key];
            if (typeof score === 'number' && score >= 0) {
              validScores.push([key, score]);
            }
          });
          if (validScores.length > 0) {
            validScores.sort((a, b) => b[1] - a[1]);
            const dominantKey = validScores[0]?.[0] ?? '';
            const dominantScore = validScores[0]?.[1] ?? 0;
            if (dominantScore > 0) {
              backgroundColor = dominantKey && dominantKey in RIASEC_COLORS 
                ? RIASEC_COLORS[dominantKey] 
                : 'bg-gray-400';
              const topThreeKeys = validScores.slice(0, 3).map((entry) => entry[0]);
              riasecDisplay = topThreeKeys.join('');
            } else {
              riasecDisplay = '---';
            }
          }
        }
        return (
          <div
            className="inline-flex h-6 w-6 items-center justify-center rounded-md font-medium text-xs"
            style={{ backgroundColor }}
          >
            {riasecDisplay}
          </div>
        );
      },
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
        row.original.option && <span className="truncate">{row.original.option}</span>,
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
        row.original.activitySector && (
          <span className="truncate">{row.original.activitySector}</span>
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
        if (minDuration !== null || maxDuration !== null) {
          return (
            <span className="truncate">
              {minDuration !== null && maxDuration !== null
                ? `${minDuration} - ${maxDuration} ${dictionary.common.years}`
                : minDuration !== null
                  ? `${dictionary.common.minDuration}: ${minDuration} ${dictionary.common.years}`
                  : `${dictionary.common.maxDuration}: ${maxDuration} ${dictionary.common.years}`}
            </span>
          );
        }
        return null;
      },
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
        row.original.effectiveDate && (
          <span>{new Date(row.original.effectiveDate).toLocaleDateString(lang)}</span>
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
          <details className="group text-sm">
            <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-500 dark:text-white/70 mb-1 list-none">
              <span>{dictionary.common.clickToViewMore}</span>
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-2 text-gray-600 dark:text-white/70">{row.original.description}</p>
          </details>
        ) : (
          <div className="flex items-center justify-center text-gray-500 dark:text-white/70">
            <ChevronDown className="h-4 w-4" />
          </div>
        ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const profession = row.original;

        return (
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
              <DropdownMenuItem className="cursor-pointer">
                {dictionary.professionsPage.evaluate}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: professions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-center mb-10">
        <Input
          placeholder={`${dictionary.common.search}...`}
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
          className="max-w-sm bg-card"
        />
      </div>
      <div className="rounded-lg border bg-card">
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
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {dictionary.common.noProfessionsFound}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
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
    </div>
  );
};
