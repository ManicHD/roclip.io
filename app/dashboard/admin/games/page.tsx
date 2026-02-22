"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, ExternalLink, Gamepad2, Search, GripVertical } from "lucide-react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface FeaturedGame {
    id: number;
    gameId: string;
    title: string;
    thumbnail: string;
    playing: number;
    visits: number;
    createdAt: string;
}

interface SortableGameRowProps {
    game: FeaturedGame;
    onDelete: (id: number) => void;
    formatNumber: (num: number) => string;
}

function SortableGameRow({ game, onDelete, formatNumber }: SortableGameRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: game.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        position: 'relative' as const,
    };

    return (
        <tr ref={setNodeRef} style={style} className={`hover:bg-white/[0.04] transition-colors border-b border-white/5 ${isDragging ? 'opacity-95 shadow-2xl scale-[1.01] bg-white/10 z-50' : ''}`}>
            <td className="px-4 py-4 w-12 text-center active:cursor-grabbing touch-none select-none">
                <button
                    {...attributes}
                    {...listeners}
                    className="p-1 text-gray-600 hover:text-white cursor-grab active:cursor-grabbing transition-colors"
                >
                    <GripVertical className="w-5 h-5 focus:outline-none" />
                </button>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 flex-shrink-0">
                        <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" draggable={false} />
                    </div>
                    <div className="font-medium text-white max-w-[200px] truncate" title={game.title}>
                        {game.title}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                {game.gameId}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400">
                {formatNumber(game.playing)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-400">
                {formatNumber(game.visits)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-3 pointer-events-auto">
                    <a
                        href={`https://www.roblox.com/games/${game.gameId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="View on Roblox"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                        onClick={() => onDelete(game.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        title="Remove from featured"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default function FeaturedGamesAdmin() {
    const [games, setGames] = useState<FeaturedGame[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newGameId, setNewGameId] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/api/games`);
            if (!res.ok) throw new Error("Failed to fetch games");
            const data = await res.json();
            setGames(data.games || []);
        } catch (err) {
            console.error("Error fetching games:", err);
            setError("Failed to load featured games");
        } finally {
            setLoading(false);
        }
    };

    const handleAddGame = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGameId.trim()) return;

        try {
            setIsAdding(true);
            setError(null);
            const res = await fetch(`${API_URL}/api/admin/games`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ gameIdentifier: newGameId }),
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to add game");
            }

            setNewGameId("");
            fetchGames(); // Refresh the list
        } catch (err: any) {
            console.error("Error adding game:", err);
            setError(err.message);
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteGame = async (id: number) => {
        if (!confirm("Are you sure you want to remove this game from the featured list?")) return;

        try {
            const res = await fetch(`${API_URL}/api/admin/games/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete game");
            }

            setGames(games.filter((g) => g.id !== id));
        } catch (err: any) {
            console.error("Error deleting game:", err);
            alert(err.message);
        }
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = games.findIndex((g) => g.id === active.id);
            const newIndex = games.findIndex((g) => g.id === over.id);

            const newGames = arrayMove(games, oldIndex, newIndex);
            setGames(newGames); // Optimistic UI update

            try {
                const res = await fetch(`${API_URL}/api/admin/games/reorder`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderedIds: newGames.map(g => g.id) }),
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Failed to save new order");
            } catch (err: any) {
                console.error("Error saving dragged order:", err);
                fetchGames(); // Revert local state on failure
                alert("Failed to save the new order.");
            }
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Featured Games</h1>
                <p className="text-gray-400 mt-2">
                    Manage the list of games displayed on the public /games page.
                </p>
            </div>

            {/* Add Game Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
            >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Gamepad2 className="h-5 w-5 text-blue-400" /> Add New Game
                </h3>

                {error && (
                    <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAddGame} className="flex gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            value={newGameId}
                            onChange={(e) => setNewGameId(e.target.value)}
                            placeholder="Enter Roblox Place ID or Game URL..."
                            className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            disabled={isAdding}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isAdding || !newGameId.trim()}
                        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isAdding ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Plus className="h-5 w-5" />
                        )}
                        Add Game
                    </button>
                </form>
            </motion.div>

            {/* Games List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden"
            >
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                ) : games.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        No featured games yet. Add one above!
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-black/20">
                                        <th className="px-4 py-4 w-12"></th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-300">Game</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-300">Place ID</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-300">Active Players</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-300">Total Visits</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-300 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-black/10">
                                    <SortableContext
                                        items={games.map(g => g.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {games.map((game) => (
                                            <SortableGameRow
                                                key={game.id}
                                                game={game}
                                                onDelete={handleDeleteGame}
                                                formatNumber={formatNumber}
                                            />
                                        ))}
                                    </SortableContext>
                                </tbody>
                            </table>
                        </DndContext>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
