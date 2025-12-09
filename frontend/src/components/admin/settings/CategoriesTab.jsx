import { useState } from 'react'
import Card from '../../UI/Card'
import Button from '../../UI/Button'
import Input from '../../UI/Input'
import { Plus, Trash2, Edit2, Check, X, Tag } from 'lucide-react'

export default function CategoriesTab({ categories = [], onUpdate }) {
    const [newCategory, setNewCategory] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [editValue, setEditValue] = useState('')

    const handleAdd = () => {
        if (!newCategory.trim()) return
        const newCat = {
            id: Date.now().toString(),
            name: newCategory.trim(),
            count: 0
        }
        onUpdate([...categories, newCat])
        setNewCategory('')
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            onUpdate(categories.filter(c => c.id !== id))
        }
    }

    const startEdit = (cat) => {
        setEditingId(cat.id)
        setEditValue(cat.name)
    }

    const saveEdit = () => {
        if (!editValue.trim()) return
        const updated = categories.map(c =>
            c.id === editingId ? { ...c, name: editValue.trim() } : c
        )
        onUpdate(updated)
        setEditingId(null)
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditValue('')
    }

    return (
        <Card className="!shadow-sm !border-gray-200" hover={false}>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Job Categories</h2>
                <p className="text-sm text-gray-500 mt-1">Manage the categories available for gig postings.</p>
            </div>

            <div className="flex gap-4 mb-8">
                <div className="flex-1">
                    <Input
                        placeholder="New category name..."
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="!mb-0"
                        leftIcon={Tag}
                    />
                </div>
                <Button onClick={handleAdd} disabled={!newCategory.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                </Button>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Gigs</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="px-6 py-8 text-center text-sm text-gray-500">
                                    No categories found. Add one above.
                                </td>
                            </tr>
                        ) : (
                            categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {editingId === cat.id ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    className="border rounded px-2 py-1 text-sm w-full focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    autoFocus
                                                />
                                            </div>
                                        ) : (
                                            cat.name
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {cat.count || 0} gigs
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {editingId === cat.id ? (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={saveEdit} className="text-green-600 hover:text-green-900 bg-green-50 p-1 rounded"><Check className="w-4 h-4" /></button>
                                                <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600 bg-gray-50 p-1 rounded"><X className="w-4 h-4" /></button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-3">
                                                <button onClick={() => startEdit(cat)} className="text-primary-600 hover:text-primary-900"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(cat.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}
