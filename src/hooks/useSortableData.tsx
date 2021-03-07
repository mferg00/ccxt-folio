import { useState, useMemo } from 'react'

export type SortConfig = {
  key: string,
  direction: 'asc' | 'desc'
}

// https://www.smashingmagazine.com/2020/03/sortable-tables-react/
const useSortableData = (items: any[], config: SortConfig) => {
  const [sortConfig, setSortConfig] = useState(config)

  const sortedItems = useMemo(() => {
    let sortableItems = [...items]

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        else if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      })
    }

    return sortableItems
  }, [items, sortConfig])

  const requestSort = (key: string, direction: SortConfig['direction'] | 'flip') => {
    if (direction === 'flip') {
      // if we're flipping the actively sorted column 
      if (key && sortConfig.key && sortConfig.key === key) {
        if (sortConfig.direction === 'asc') {
          direction = 'desc'
        } else {
          direction = 'asc'
        }
      } else {
        direction = 'desc'
      }
    }

    setSortConfig({ key, direction });
  }

  return { sortedItems, requestSort, sortConfig }
}

export default useSortableData