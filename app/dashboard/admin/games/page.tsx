"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, ExternalLink, Gamepad2, Globe, Search, GripVertical, Link, ImageIcon } from "lucide-react";
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

interface Service {
    id: number;
    name: string;
    url: string;
    imageUrl: string | null;
    createdAt: string;
}

interface SortableGameRowProps {
    game: FeaturedGame;
    onDelete: (id: number) => void;
    formatNumber: (num: number) => string;
}

function SortableGameRow({ game, onDelete, formatNumber }: SortableGameRowProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: game.id });
    const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 'auto', position: 'relative' as const };

    return (
        <tr ref={setNodeRef} style={style} className={`hover:bg-white/[0.04] transition-colors border-b border-white/5 ${isDragging ? 'opacity-95 shadow-2xl scale-[1.01] bg-white/10 z-50' : ''}`}>
            <td className="px-4 py-4 w-12 text-center active:cursor-grabbing touch-none select-none">
                <button {...attributes} {...listeners} className="p-1 text-gray-600 hover:text-white cursor-grab active:cursor-grabbing transition-colors">
                    <GripVertical className="w-5 h-5 focus:outline-none" />
                </button>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 flex-shrink-0">
                        <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" draggable={false} />
                    </div>
                    <div className="font-medium text-white max-w-[200px] truncate" title={game.title}>{game.title}</div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">{game.gameId}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400">{formatNumber(game.playing)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-400">{formatNumber(game.visits)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-3">
                    <a href={`https://www.roblox.com/games/${game.gameId}`} target="_blank" rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title="View on Roblox">
                        <ExternalLink className="w-4 h-4" />
                    </a>
                    <button onClick={() => onDelete(game.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Remove">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

type AdminTab = "games" | "services";

export default function FeaturedGamesAdmin() {
    const [adminTab, setAdminTab] = useState<AdminTab>("games");

    // Games state
    const [games, setGames] = useState<FeaturedGame[]>([]);
    const [gamesLoading, setGamesLoading] = useState(true);
    const [gamesError, setGamesError] = useState<string | null>(null);
    const [newGameId, setNewGameId] = useState("");
    const [isAddingGame, setIsAddingGame] = useState(false);

    // Services state
    const [services, setServices] = useState<Service[]>([]);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [servicesError, setServicesError] = useState<string | null>(null);
    const [newServiceName, setNewServiceName] = useState("");
    const [newServiceUrl, setNewServiceUrl] = useState("");
    const [newServiceImage, setNewServiceImage] = useState<string | null>(null);
    const [isAddingService, setIsAddingService] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => { fetchGames(); fetchServices(); }, []);

    // ── Games ──────────────────────────────────────────────────────────────────
    const fetchGames = async () => {
        try {
            setGamesLoading(true);
            const res = await fetch(`${API_URL}/api/games`);
            if (!res.ok) throw new Error("Failed to fetch games");
            const data = await res.json();
            setGames(data.games || []);
        } catch (err) {
            setGamesError("Failed to load featured games");
        } finally {
            setGamesLoading(false);
        }
    };

    const handleAddGame = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGameId.trim()) return;
        try {
            setIsAddingGame(true);
            setGamesError(null);
            const res = await fetch(`${API_URL}/api/admin/games`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ gameIdentifier: newGameId }),
                credentials: "include",
            });
            const isJson = res.headers.get("content-type")?.includes("application/json");
            if (!res.ok) {
                const msg = isJson ? (await res.json()).error : `Server error ${res.status}`;
                throw new Error(msg || "Failed to add game");
            }
            setNewGameId("");
            fetchGames();
        } catch (err: any) {
            setGamesError(err.message);
        } finally {
            setIsAddingGame(false);
        }
    };

    const handleDeleteGame = async (id: number) => {
        if (!confirm("Remove this game from the featured list?")) return;
        try {
            const res = await fetch(`${API_URL}/api/admin/games/${id}`, { method: "DELETE", credentials: "include" });
            if (!res.ok) {
                const isJson = res.headers.get("content-type")?.includes("application/json");
                const msg = isJson ? (await res.json()).error : `Server error ${res.status}`;
                throw new Error(msg || "Failed to delete game");
            }
            setGames(games.filter((g) => g.id !== id));
        } catch (err: any) { alert(err.message); }
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
            setGames(newGames);
            try {
                const res = await fetch(`${API_URL}/api/admin/games/reorder`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderedIds: newGames.map(g => g.id) }),
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Failed to save new order");
            } catch {
                fetchGames();
                alert("Failed to save the new order.");
            }
        }
    };

    // ── Services ───────────────────────────────────────────────────────────────
    const fetchServices = async () => {
        try {
            setServicesLoading(true);
            const res = await fetch(`${API_URL}/api/services`);
            if (res.status === 404) { setServices([]); return; }
            if (!res.ok) throw new Error("Failed to fetch services");
            const data = await res.json();
            setServices(data.services || []);
        } catch (err) {
            setServicesError("Failed to load services");
        } finally {
            setServicesLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setNewServiceImage(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleAddService = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newServiceName.trim() || !newServiceUrl.trim()) return;
        try {
            setIsAddingService(true);
            setServicesError(null);
            const url = newServiceUrl.startsWith("http") ? newServiceUrl : `https://${newServiceUrl}`;
            const res = await fetch(`${API_URL}/api/admin/services`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newServiceName, url, imageUrl: newServiceImage }),
                credentials: "include",
            });
            const isJson = res.headers.get("content-type")?.includes("application/json");
            if (!res.ok) {
                const msg = isJson ? (await res.json()).error : `Server error ${res.status}`;
                throw new Error(msg || "Failed to add service");
            }
            setNewServiceName("");
            setNewServiceUrl("");
            setNewServiceImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            fetchServices();
        } catch (err: any) {
            setServicesError(err.message);
        } finally {
            setIsAddingService(false);
        }
    };

    const handleDeleteService = async (id: number) => {
        if (!confirm("Remove this service?")) return;
        try {
            const res = await fetch(`${API_URL}/api/admin/services/${id}`, { method: "DELETE", credentials: "include" });
            if (!res.ok) {
                const isJson = res.headers.get("content-type")?.includes("application/json");
                const msg = isJson ? (await res.json()).error : `Server error ${res.status}`;
                throw new Error(msg || "Failed to delete service");
            }
            setServices(services.filter((s) => s.id !== id));
        } catch (err: any) { alert(err.message); }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Featured Games & Services</h1>
                <p className="text-gray-400 mt-2">Manage games and services displayed on the public /games page.</p>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-2">
                {(["games", "services"] as AdminTab[]).map((tab) => (
                    <button key={tab} onClick={() => setAdminTab(tab)}
                        className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-200 ${adminTab === tab ? "bg-white text-black" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"}`}>
                        {tab === "games"
                            ? <span className="flex items-center gap-2"><Gamepad2 className="w-4 h-4" /> Games</span>
                            : <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> Services</span>}
                    </button>
                ))}
            </div>

            {/* ── GAMES TAB ── */}
            {adminTab === "games" && (
                <>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                        className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <Gamepad2 className="h-5 w-5 text-blue-400" /> Add New Game
                        </h3>
                        {gamesError && <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{gamesError}</div>}
                        <form onSubmit={handleAddGame} className="flex gap-4">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-500" /></div>
                                <input type="text" value={newGameId} onChange={(e) => setNewGameId(e.target.value)}
                                    placeholder="Enter Roblox Place ID or Game URL..."
                                    className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    disabled={isAddingGame} />
                            </div>
                            <button type="submit" disabled={isAddingGame || !newGameId.trim()}
                                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                {isAddingGame ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="h-5 w-5" />}
                                Add Game
                            </button>
                        </form>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden">
                        {gamesLoading ? (
                            <div className="p-12 flex justify-center"><div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>
                        ) : games.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">No featured games yet. Add one above!</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
                                            <SortableContext items={games.map(g => g.id)} strategy={verticalListSortingStrategy}>
                                                {games.map((game) => (
                                                    <SortableGameRow key={game.id} game={game} onDelete={handleDeleteGame} formatNumber={formatNumber} />
                                                ))}
                                            </SortableContext>
                                        </tbody>
                                    </table>
                                </DndContext>
                            </div>
                        )}
                    </motion.div>
                </>
            )}

            {/* ── SERVICES TAB ── */}
            {adminTab === "services" && (
                <>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                        className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                        <h3 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
                            <Globe className="h-5 w-5 text-purple-400" /> Add New Service
                        </h3>
                        {servicesError && <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{servicesError}</div>}
                        <form onSubmit={handleAddService} className="space-y-4">
                            <div className="flex gap-4 flex-col sm:flex-row">
                                <input type="text" value={newServiceName} onChange={(e) => setNewServiceName(e.target.value)}
                                    placeholder="Service name (e.g. BloxClips)"
                                    className="flex-1 px-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                    disabled={isAddingService} />
                                <div className="flex-[2] relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Link className="h-5 w-5 text-gray-500" /></div>
                                    <input type="text" value={newServiceUrl} onChange={(e) => setNewServiceUrl(e.target.value)}
                                        placeholder="https://example.com"
                                        className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                        disabled={isAddingService} />
                                </div>
                            </div>

                            {/* Image upload */}
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-3 px-4 py-3 border border-white/10 rounded-xl bg-black/40 cursor-pointer hover:bg-white/5 transition-colors flex-1">
                                    <ImageIcon className="h-5 w-5 text-gray-500 shrink-0" />
                                    <span className="text-sm text-gray-400 truncate">
                                        {newServiceImage ? "Image selected ✓" : "Upload logo / image"}
                                    </span>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={isAddingService} />
                                </label>
                                {newServiceImage && (
                                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-neutral-900 flex-shrink-0">
                                        <img src={newServiceImage} alt="preview" className="w-full h-full object-contain p-1" />
                                    </div>
                                )}
                                <button type="submit" disabled={isAddingService || !newServiceName.trim() || !newServiceUrl.trim()}
                                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap">
                                    {isAddingService ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="h-5 w-5" />}
                                    Add Service
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden">
                        {servicesLoading ? (
                            <div className="p-12 flex justify-center"><div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" /></div>
                        ) : services.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">No services yet. Add one above!</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-black/20">
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-300">Service</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-300">URL</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-300 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-black/10">
                                        {services.map((service) => (
                                            <tr key={service.id} className="hover:bg-white/[0.04] transition-colors border-b border-white/5">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 flex-shrink-0 flex items-center justify-center">
                                                            {service.imageUrl
                                                                ? <img src={service.imageUrl} alt={service.name} className="w-full h-full object-contain p-1" />
                                                                : <Globe className="w-5 h-5 text-gray-500" />}
                                                        </div>
                                                        <div className="font-medium text-white max-w-[200px] truncate">{service.name}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono max-w-xs truncate">{service.url}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <a href={service.url} target="_blank" rel="noopener noreferrer"
                                                            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                        <button onClick={() => handleDeleteService(service.id)}
                                                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </div>
    );
}
