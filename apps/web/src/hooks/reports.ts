import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '#/api'
import type { ListReportsQuery, UpdateReportRequest } from '@medi-track/types'

export const reportKeys = {
  all: ['reports'] as const,
  filters: () => [...reportKeys.all, 'filters'] as const,
  list: (query?: ListReportsQuery) => [...reportKeys.all, 'list', query] as const,
  detail: (id: string) => [...reportKeys.all, 'detail', id] as const,
}

export function useReportFilters() {
  return useQuery({
    queryKey: reportKeys.filters(),
    queryFn: api.reports.getReportFilters,
  })
}

export function useReports(query: ListReportsQuery = {}) {
  return useQuery({
    queryKey: reportKeys.list(query),
    queryFn: () => api.reports.listReports(query),
  })
}

export function useReport(id: string) {
  return useQuery({
    queryKey: reportKeys.detail(id),
    queryFn: () => api.reports.getReport(id),
  })
}

export function useCreateReportMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.reports.createReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all })
    },
  })
}

export function useReplaceReportFileMutation(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => api.reports.replaceReportFile(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: reportKeys.all })
    },
  })
}

export function useUpdateReportMutation(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateReportRequest) => api.reports.updateReport(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: reportKeys.all })
    },
  })
}

export function useDeleteReportMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.reports.deleteReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all })
    },
  })
}
