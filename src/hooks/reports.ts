import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '#/api'
import type { UpdateReportInput } from '#/api/reports'

export const reportKeys = {
  all: ['reports'] as const,
  list: () => [...reportKeys.all, 'list'] as const,
  detail: (id: string) => [...reportKeys.all, 'detail', id] as const,
}

export function useReports() {
  return useQuery({
    queryKey: reportKeys.list(),
    queryFn: api.reports.listReports,
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
      queryClient.invalidateQueries({ queryKey: reportKeys.list() })
    },
  })
}

export function useUpdateReportMutation(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateReportInput) => api.reports.updateReport(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: reportKeys.list() })
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
