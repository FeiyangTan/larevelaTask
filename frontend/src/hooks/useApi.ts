import { useQueryClient } from '@tanstack/react-query';
import {
  useGetItems,
  useGetItemById,
  useCreateItem as useCreateItemApi,
  useUpdateItem as useUpdateItemApi,
  useDeleteItem as useDeleteItemApi,
} from '../api/generated/endpoints';

export function useItemsList() {
  return useGetItems({
    query: {
      queryKey: ['items'],
    },
  });
}

export function useItem(id: string | null) {
  const safeId = id ?? '';

  return useGetItemById(safeId, {
    query: {
      queryKey: ['items', id],
      enabled: !!id,
    },
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useCreateItemApi({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['items'] });
      },
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useUpdateItemApi({
    mutation: {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['items'] });
        queryClient.invalidateQueries({
          queryKey: ['items', variables.id],
        });
      },
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useDeleteItemApi({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['items'] });
      },
    },
  });
}