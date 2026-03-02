import { useState } from 'react';
import { useItemsList, useCreateItem } from '../hooks/useApi';
import { ErrorMessage, Loading } from '../components';

export function ApiDemo() {
  const [newName, setNewName] = useState('');
  const { data, isLoading, error, refetch } = useItemsList({ page: 1, limit: 10 });
  const createItem = useCreateItem();

  const handleCreate = () => {
    if (!newName.trim()) return;
    createItem.mutate(
      { name: newName.trim() },
      {
        onSuccess: () => setNewName(''),
        onError: () => {},
      }
    );
  };

  return (
    <div>
      <h1>API Demo</h1>
      <p>Configure <code>VITE_API_BASE_URL</code> and ensure your API matches the Swagger/Postman spec.</p>

      {error && (
        <ErrorMessage
          message={error instanceof Error ? error.message : 'Failed to load'}
          onDismiss={() => refetch()}
        />
      )}
      {createItem.isError && (
        <ErrorMessage
          message={createItem.error instanceof Error ? createItem.error.message : 'Create failed'}
          onDismiss={() => createItem.reset()}
        />
      )}

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New item name"
          style={{ marginRight: '0.5rem', padding: '0.5rem' }}
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={createItem.isPending || !newName.trim()}
        >
          {createItem.isPending ? 'Creating…' : 'Create'}
        </button>
      </div>

      {isLoading && <Loading />}
      {data && (
        <pre style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '6px', overflow: 'auto' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
