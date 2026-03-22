import { useMemo, useState } from 'react';
import {
    useItemsList,
    useItem,
    useCreateItem,
    useUpdateItem,
    useDeleteItem,
} from '../hooks/useApi';
import { ErrorMessage, Loading } from '../components';

type Item = {
    id: string;
    name: string;
    description?: string;
    createdAt?: string;
};

export function ApiDemo() {
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');

    const { data, isLoading, error, refetch } = useItemsList();
    const { data: selectedItem } = useItem(selectedId);

    const createItem = useCreateItem();
    const updateItem = useUpdateItem();
    const deleteItem = useDeleteItem();

    const items: Item[] = useMemo(() => {
        return Array.isArray(data) ? (data as Item[]) : [];
    }, [data]);

    // CREATE
    const handleCreate = () => {
        if (!newName.trim()) return;

        createItem.mutate({
            data: {
                name: newName.trim(),
                description: newDescription.trim() || undefined,
            },
        });

        setNewName('');
        setNewDescription('');
    };

    // SELECT
    const handleSelect = (item: Item) => {
        setSelectedId(item.id);
        setEditName(item.name ?? '');
        setEditDescription(item.description ?? '');
    };

    // UPDATE
    const handleUpdate = () => {
        if (!selectedId) return;

        updateItem.mutate({
            id: selectedId,
            data: {
                name: editName.trim(),
                description: editDescription.trim() || undefined,
            },
        });
    };

    // DELETE
    const handleDelete = (id: string) => {
        deleteItem.mutate({ id });

        if (selectedId === id) {
            setSelectedId(null);
        }
    };

    return (
        <div>
            <h1>API Demo</h1>

            {error && (
                <ErrorMessage
                    message={error instanceof Error ? error.message : 'Failed to load'}
                    onDismiss={() => refetch()}
                />
            )}

            {/* CREATE */}
            <div style={{ marginBottom: '1rem' }}>
                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Name"
                />
                <input
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Description"
                />
                <button onClick={handleCreate} disabled={createItem.isPending}>
                    {createItem.isPending ? 'Creating...' : 'Create'}
                </button>
            </div>

            {/* LIST */}
            {isLoading && <Loading />}
            {items.map((item) => (
                <div key={item.id} style={{ border: '1px solid #ccc', marginBottom: 8 }}>
                    <div>{item.name}</div>
                    <button onClick={() => handleSelect(item)}>Edit</button>
                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
            ))}

            {/* UPDATE */}
            {selectedId && (
                <div style={{ marginTop: 20 }}>
                    <h3>Edit Item</h3>
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                    <input
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                    />
                    <button onClick={handleUpdate} disabled={updateItem.isPending}>
                        {updateItem.isPending ? 'Updating...' : 'Update'}
                    </button>
                </div>
            )}

            {/* DEBUG */}
            {selectedItem && (
                <pre style={{ marginTop: 20 }}>
          {JSON.stringify(selectedItem, null, 2)}
        </pre>
            )}
        </div>
    );
}