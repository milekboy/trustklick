'use client'

import { useEffect, useState, useMemo } from 'react'
import NetworkInstance from '@/components/NetworkInstance'
import { useAuth } from '@/components/AuthContext'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import InputAdornment from '@mui/material/InputAdornment'
import TablePagination from '@mui/material/TablePagination'
import { useRouter } from 'next/navigation'
import classnames from 'classnames'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import OptionMenu from '@core/components/option-menu'
import tableStyles from '@core/styles/table.module.css'

type KlickType = {
  id: number
  name: string
  whatsapp_group_link: string
  announcement: string
  invite_url: string
  is_admin?: boolean
  member_count?: number
}

type KlickWithActions = KlickType & {
  actions?: string
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  const { color, ...inputProps } = props as any

  return (
    <TextField
      {...inputProps}
      value={value}
      onChange={e => setValue(e.target.value)}
      size='small'
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position='start'>
              <i className='ri-search-line' />
            </InputAdornment>
          )
        }
      }}
    />
  )
}

const columnHelper = createColumnHelper<KlickWithActions>()

export default function KlickList() {
  const api = NetworkInstance()
  const { token } = useAuth()
  const router = useRouter()

  const [klicks, setKlicks] = useState<KlickType[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [globalFilter, setGlobalFilter] = useState('')

  // Fetch Klicks
  useEffect(() => {
    const fetchKlicks = async () => {
      try {
        const res = await api.get('/klicks', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setKlicks(res.data.data || [])
      } catch (err) {
        console.error('Error fetching klicks:', err)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchKlicks()
    }
  }, [token])

  // Copy Invite URL
  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const columns = useMemo<ColumnDef<KlickWithActions, any>[]>(
    () => [
      columnHelper.accessor('name', {
        header: 'Klick Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.name}
              </Typography>
              {row.original.is_admin && (
                <Chip label='Admin' size='small' variant='tonal' color='primary' className='w-fit' />
              )}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('whatsapp_group_link', {
        header: 'WhatsApp Group',
        cell: ({ row }) => (
          <Button
            variant='text'
            size='small'
            href={row.original.whatsapp_group_link}
            target='_blank'
            startIcon={<i className='ri-whatsapp-line' />}
          >
            Open Group
          </Button>
        )
      }),
      columnHelper.accessor('announcement', {
        header: 'Announcement',
        cell: ({ row }) => (
          <Typography variant='body2' className='max-w-xs truncate'>
            {row.original.announcement || 'No announcement'}
          </Typography>
        )
      }),
      columnHelper.accessor('member_count', {
        header: 'Members',
        cell: ({ row }) => <Chip label={`${row.original.member_count || 0} members`} size='small' variant='outlined' />
      }),
      columnHelper.accessor('invite_url', {
        header: 'Invite Link',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Typography variant='body2' className='font-mono text-xs max-w-xs truncate'>
              {row.original.invite_url}
            </Typography>
            <Tooltip title={copiedId === row.original.id ? 'Copied!' : 'Copy invite URL'}>
              <IconButton size='small' onClick={() => copyToClipboard(row.original.invite_url, row.original.id)}>
                <i className='ri-file-copy-line text-lg' />
              </IconButton>
            </Tooltip>
          </div>
        )
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
            <Button
              variant='outlined'
              size='small'
              onClick={() => router.push(`/dashboards/view-klicks/${row.original.id}`)}
            >
              View
            </Button>
            <OptionMenu
              iconButtonProps={{ size: 'small' }}
              iconClassName='text-textSecondary'
              options={[
                {
                  text: 'View Details',
                  icon: 'ri-eye-line',
                  menuItemProps: {
                    onClick: () => router.push(`/dashboards/view-klicks/${row.original.id}`)
                  }
                },
                {
                  text: 'Copy Invite Link',
                  icon: 'ri-file-copy-line',
                  menuItemProps: {
                    onClick: () => copyToClipboard(row.original.invite_url, row.original.id)
                  }
                }
              ]}
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    [copiedId, router]
  )

  const table = useReactTable({
    data: klicks as KlickWithActions[],
    columns,
    filterFns: {
      fuzzy: (row, columnId, value) => {
        const cellValue = row.getValue(columnId) as string
        return cellValue?.toLowerCase().includes(value.toLowerCase())
      }
    },
    state: {
      globalFilter
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'fuzzy',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <CircularProgress />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader
        title='All Klicks'
        subheader={`${klicks.length} Klick${klicks.length !== 1 ? 's' : ''} found`}
        action={
          <div className='flex items-center gap-3'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search Klicks...'
              className='min-is-[200px]'
            />
          </div>
        }
      />
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={classnames({
                          'flex items-center': header.column.getIsSorted(),
                          'cursor-pointer select-none': header.column.getCanSort()
                        })}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <i className='ri-arrow-up-s-line text-xl' />,
                          desc: <i className='ri-arrow-down-s-line text-xl' />
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className='text-center p-8'>
                  <Typography variant='body1' color='text.secondary'>
                    {globalFilter
                      ? 'No Klicks found matching your search.'
                      : 'No Klicks available. Create your first Klick!'}
                  </Typography>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <TablePagination
        component='div'
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
        onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Card>
  )
}
