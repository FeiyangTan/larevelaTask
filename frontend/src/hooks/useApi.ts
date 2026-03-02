import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

/**
 * Example hook for GET list – replace path and type with your Swagger endpoints.
 */
export function useItemsList(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['items', params],
    queryFn: () => api.get<{ data: unknown[] }>('/items', { params }),
  });
}

/**
 * Example hook for GET by id.
 */
export function useItem(id: string | null) {
  return useQuery({
    queryKey: ['items', id],
    queryFn: () => api.get<unknown>(`/items/${id}`),
    enabled: !!id,
  });
}

/**
 * Example hook for POST create – replace path and body type with your API.
 */
export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => api.post<unknown>('/items', body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  });
}

/**
 * Example hook for PUT/PATCH update.
 */
export function useUpdateItem(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => api.patch<unknown>(`/items/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['items', id] });
    },
  });
}

/**
 * Example hook for DELETE.
 */
export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/items/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  });
}
