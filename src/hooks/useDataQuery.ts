import type { EntityTable } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useState } from 'react'

type SortDirection = 'asc' | 'desc'
interface Sort {
  field: string
  direction: SortDirection
}

type SortState = Sort | null

type FilterOperator =
  | 'equals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'between'

interface Filter {
  field: string
  operator: FilterOperator
  value: any
  secondValue?: any
}

interface useDataQueryOptions<T> {
  //@ts-ignore
  table: EntityTable<T, 'id'>
  initialPageSize?: number
  searchField?: string
  initialSort?: Sort
  initialFilters?: Filter[]
}

export const useDataQuery = <T>(options: useDataQueryOptions<T>) => {
  const {
    table,
    initialPageSize = 10,
    searchField = 'name',
    initialSort = { field: 'id', direction: 'desc' },
    initialFilters = [],
  } = options

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [search, setSearch] = useState('')
  const [selectedRecords, setSelectedRecords] = useState<T[]>([])
  const [sort, setSort] = useState<SortState>(initialSort)
  const [filters, setFilters] = useState<Filter[]>(initialFilters)

  const applyFilter = (query: any, filter: Filter) => {
    const { field, operator, value, secondValue } = filter
    switch (operator) {
      case 'equals':
        return query.filter((item: any) => item[field] === value)
      case 'contains':
        return query.filter((item: any) =>
          String(item[field])
            .toLowerCase()
            .includes(String(value).toLowerCase()),
        )
      case 'startsWith':
        return query.filter((item: any) =>
          String(item[field])
            .toLowerCase()
            .startsWith(String(value).toLowerCase()),
        )
      case 'endsWith':
        return query.filter((item: any) =>
          String(item[field])
            .toLowerCase()
            .endsWith(String(value).toLowerCase()),
        )
      case 'greaterThan':
        return query.filter((item: any) => item[field] > value)
      case 'lessThan':
        return query.filter((item: any) => item[field] < value)
      case 'between':
        return query.filter(
          (item: any) =>
            item[field] >= value && item[field] <= (secondValue ?? value),
        )
      default:
        return query
    }
  }

  const data = useLiveQuery(async () => {
    if (pageSize <= 0) return { data: [], totalItems: 0, hasMore: false }

    const startIndex = (page - 1) * pageSize
    let query = search
      ? table.where(searchField).startsWithIgnoreCase(search)
      : table.toCollection()
    let results = await query.toArray()

    filters.forEach((filter) => {
      results = applyFilter(results, filter)
    })

    if (sort) {
      results.sort((a: any, b: any) => {
        const aValue = a[sort.field]
        const bValue = b[sort.field]

        if (aValue === bValue) return 0
        const comparison = aValue > bValue ? 1 : -1
        return sort.direction === 'asc' ? comparison : -comparison
      })
    }

    const paginatedResults = results.slice(startIndex, startIndex + pageSize)

    return {
      data: paginatedResults,
      totalItems: results.length,
      hasMore: startIndex + paginatedResults.length < results.length,
    }
  }, [page, pageSize, search, sort, filters])

  const _delete = async (id: any) => {
    if (confirm('Are you sure?')) {
      await table.delete(id)
    }
  }

  const toggleSort = (field: string) => {
    setSort((currentSort) => {
      // Case 1: No current sort, or a new column is clicked. Start with 'asc'.
      if (!currentSort || currentSort.field !== field) {
        return { field, direction: 'asc' }
      }
      // Case 2: Currently sorted 'asc'. Switch to 'desc'.
      if (currentSort.direction === 'asc') {
        return { field, direction: 'desc' }
      }
      // Case 3: Currently sorted 'desc'. Switch to null to remove sorting.
      if (currentSort.direction === 'desc') {
        return null
      }
      // Fallback, should not be reached.
      return currentSort
    })
  }

  const addFilter = (filter: Filter) => {
    setFilters((prev) => [...prev, filter])
    setPage(1)
  }

  const removeFilter = (index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index))
    setPage(1)
  }

  const updateFilter = (index: number, filter: Filter) => {
    setFilters((prev) => prev.map((f, i) => (i === index ? filter : f)))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters([])
    setPage(1)
  }

  const derivedData = useMemo(
    () => ({
      data: data?.data ?? [],
      totalRecords: data?.totalItems ?? 0,
      hasMore: data?.hasMore ?? false,
    }),
    [data],
  )

  return {
    ...derivedData,
    selectedRecords,
    page,
    pageSize,
    search,
    sort,
    filters,
    setPage,
    setPageSize,
    setSelectedRecords,
    setSearch,
    toggleSort,
    addFilter,
    removeFilter,
    updateFilter,
    clearFilters,
    _delete,
    searchField,
  }
}

export default useDataQuery
