// src/hooks/useDataQuery.ts
import type { EntityTable } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useState } from 'react'

type SortDirection = 'asc' | 'desc'

interface Sort {
  field: string
  direction: SortDirection
}

type SortState = Sort | null

// START: MODIFIED - Added new filter operators for contact count and array checks
export type FilterOperator =
  | 'equals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'between'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'countGreaterThan'
// END: MODIFIED

export interface Filter {
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

  const applyFilter = (data: any[], filter: Filter) => {
    const { field, operator, value } = filter

    // START: MODIFIED - Added logic for new operators and improved filtering
    return data.filter((item: any) => {
      const itemValue = item[field]
      switch (operator) {
        case 'equals':
          return itemValue === value
        case 'contains':
          return String(itemValue)
            .toLowerCase()
            .includes(String(value).toLowerCase())
        case 'startsWith':
          return String(itemValue)
            .toLowerCase()
            .startsWith(String(value).toLowerCase())
        case 'endsWith':
          return String(itemValue)
            .toLowerCase()
            .endsWith(String(value).toLowerCase())
        case 'greaterThan':
          return itemValue > value
        case 'lessThan':
          return itemValue < value
        case 'between':
          return (
            itemValue >= value && itemValue <= (filter.secondValue ?? value)
          )
        case 'isEmpty':
          return (
            !itemValue || (Array.isArray(itemValue) && itemValue.length === 0)
          )
        case 'isNotEmpty':
          return Array.isArray(itemValue) && itemValue.length > 0
        case 'countGreaterThan':
          return Array.isArray(itemValue) && itemValue.length > value
        default:
          return true
      }
    })
    // END: MODIFIED
  }

  const data = useLiveQuery(async () => {
    if (pageSize <= 0) return { data: [], totalItems: 0, hasMore: false }
    const startIndex = (page - 1) * pageSize

    let query = search
      ? table.where(searchField).startsWithIgnoreCase(search)
      : table.toCollection()

    let results = await query.toArray()

    // Apply all filters sequentially
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
      if (!currentSort || currentSort.field !== field) {
        return { field, direction: 'asc' }
      }
      if (currentSort.direction === 'asc') {
        return { field, direction: 'desc' }
      }
      if (currentSort.direction === 'desc') {
        return null
      }
      return currentSort
    })
  }

  // START: MODIFIED - Improved filter management functions
  const addFilter = (filter: Filter) => {
    setFilters((prev) => [...prev, filter])
    setPage(1)
  }

  const removeFilter = (field: string) => {
    setFilters((prev) => prev.filter((f) => f.field !== field))
    setPage(1)
  }

  const updateFilter = (filter: Filter) => {
    setFilters((prev) => {
      const existing = prev.find((f) => f.field === filter.field)
      if (existing) {
        return prev.map((f) => (f.field === filter.field ? filter : f))
      }
      return [...prev, filter]
    })
    setPage(1)
  }
  // END: MODIFIED

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
