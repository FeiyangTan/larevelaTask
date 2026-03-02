/**
 * Shared API types. Replace with generated types from Swagger/OpenAPI when available.
 */

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Example placeholder types – align with your Swagger schema
export interface ListResponse<T> {
  data: T[];
  total?: number;
  page?: number;
  pageSize?: number;
}

export interface IdEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}
