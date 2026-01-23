"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";

export type MetricType = "views" | "earnings" | "submissions";

export interface ChartData {
    date: string;
    views: number;
    earnings: number;
    submissions: number;
}

interface DashboardChartProps {
    data: ChartData[];
    metric: MetricType;
    metricConfig: Record<MetricType, { label: string; color: string; format: (v: number) => string }>;
    height?: number;
}

export default function DashboardChart({
    data,
    metric,
    metricConfig,
    height = 280,
}: DashboardChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const config = metricConfig[metric];

    // Responsive width
    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0]) setWidth(entries[0].contentRect.width);
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    const { points, path, areaPath, max } = useMemo(() => {
        if (!data.length || width === 0) return { points: [], path: "", areaPath: "", max: 0 };

        const values = data.map((d) => d[metric]);
        const maxValue = Math.max(...values, 0);

        // Calculate nice grid lines
        const getNiceMax = (val: number) => {
            if (val === 0) return 100;
            const target = val * 1.05; // 5% headroom
            const step = target / 4;
            const power = Math.floor(Math.log10(step));
            const magnitude = Math.pow(10, power);
            const normalized = step / magnitude;

            let niceNormalized;
            if (normalized <= 1) niceNormalized = 1;
            else if (normalized <= 2) niceNormalized = 2;
            else if (normalized <= 2.5) niceNormalized = 2.5;
            else if (normalized <= 5) niceNormalized = 5;
            else niceNormalized = 10;

            return niceNormalized * magnitude * 4;
        };

        const max = getNiceMax(maxValue);

        const ptrs = data.map((d, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - (d[metric] / max) * height;
            return { x, y, data: d, value: d[metric] };
        });

        // Generate smooth path (cubic bezier)
        let d = `M ${ptrs[0].x} ${ptrs[0].y}`;
        for (let i = 0; i < ptrs.length - 1; i++) {
            const p0 = ptrs[i];
            const p1 = ptrs[i + 1];
            const cp1x = p0.x + (p1.x - p0.x) / 2;
            const cp1y = p0.y;
            const cp2x = p0.x + (p1.x - p0.x) / 2;
            const cp2y = p1.y;
            d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p1.x} ${p1.y}`;
        }

        const area = `${d} L ${width} ${height} L 0 ${height} Z`;

        return { points: ptrs, path: d, areaPath: area, max };
    }, [data, metric, width, height]);

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!width) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        // Find closest point
        const index = Math.round((x / width) * (data.length - 1));
        if (index >= 0 && index < data.length) {
            setHoveredIndex(index);
        }
    };

    if (!data.length) {
        return (
            <div className="flex items-center justify-center text-gray-500" style={{ height }}>
                No data available
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="w-full relative group cursor-crosshair select-none"
            style={{ height }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredIndex(null)}
        >
            <svg width={width} height={height} className="overflow-visible">
                <defs>
                    <linearGradient id={`gradient-fill-${metric}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={config.color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={config.color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Grid Lines & Labels */}
                {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                    <g key={t}>
                        <line
                            x1="0"
                            y1={height * t}
                            x2={width}
                            y2={height * t}
                            stroke="rgba(255,255,255,0.05)"
                            strokeDasharray="4 4"
                        />
                        <text
                            x={width}
                            y={height * t}
                            dy={t === 0 ? "1em" : t === 1 ? "-0.4em" : "0.3em"}
                            textAnchor="end"
                            className="text-[10px] fill-gray-500 font-medium opacity-60"
                        >
                            {config.format(max * (1 - t))}
                        </text>
                    </g>
                ))}

                {/* Area Fill */}
                <motion.path
                    d={areaPath}
                    fill={`url(#gradient-fill-${metric})`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                />

                {/* Line Path */}
                <motion.path
                    d={path}
                    fill="none"
                    stroke={config.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />

                {/* Hover Indicator */}
                {hoveredIndex !== null && points[hoveredIndex] && (
                    <g>
                        <line
                            x1={points[hoveredIndex].x}
                            y1={0}
                            x2={points[hoveredIndex].x}
                            y2={height}
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                        />
                        <circle
                            cx={points[hoveredIndex].x}
                            cy={points[hoveredIndex].y}
                            r="6"
                            fill={config.color}
                            stroke="#111827"
                            strokeWidth="3"
                        />
                    </g>
                )}
            </svg>

            {/* Tooltip */}
            {hoveredIndex !== null && points[hoveredIndex] && (
                <div
                    className="absolute top-0 pointer-events-none"
                    style={{
                        left: Math.min(Math.max(points[hoveredIndex].x, 0), width), // Clamp
                        transform: `translate(${hoveredIndex === points.length - 1 ? "-100%" : "-50%"}, -120%)`,
                    }}
                >
                    <div
                        className="relative rounded-xl px-4 py-3 shadow-2xl border border-white/10 z-10"
                        style={{
                            background: 'linear-gradient(180deg, rgba(17, 17, 17, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%)',
                            boxShadow: `0 0 20px ${config.color}15, 0 8px 32px rgba(0, 0, 0, 0.6)`,
                        }}
                    >
                        {/* Accent line at top */}
                        <div
                            className="absolute top-0 left-3 right-3 h-[2px] rounded-full opacity-60"
                            style={{ background: config.color }}
                        />
                        <p className="text-xs text-gray-400 mb-1.5 font-medium tracking-wide">
                            {new Date(points[hoveredIndex].data.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                            })}
                        </p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-xl font-bold text-white tracking-tight">
                                {config.format(points[hoveredIndex].value)}
                            </p>
                            <span
                                className="text-xs font-medium"
                                style={{ color: config.color }}
                            >
                                {config.label}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* X-Axis Labels */}
            <div className="absolute top-[100%] left-0 right-0 flex justify-between mt-4 px-2">
                {points
                    .filter((_, i) => i % Math.ceil(points.length / 6) === 0)
                    .map((p, i) => (
                        <span key={i} className="text-xs text-gray-500 font-medium">
                            {new Date(p.data.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                    ))}
            </div>
        </div>
    );
}
