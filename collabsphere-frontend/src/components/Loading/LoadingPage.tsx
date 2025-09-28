import { motion } from "framer-motion";

type LoadingPageProps = {
    message?: string;
    subtitle?: string;
};

export default function LoadingPage({
    message = "Loading",
    subtitle = "Please wait while we prepare things for you...",
}: LoadingPageProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                minHeight: "100vh",
                WebkitFontSmoothing: "antialiased",
                MozOsxFontSmoothing: "grayscale",
            }}
            className="flex items-center justify-center bg-white text-slate-900"
        >
            <motion.div
                aria-hidden
                className="absolute inset-0 -z-10"
                style={{
                    background: "linear-gradient(120deg,#e6f0ff,#dbeafe,#bfdbfe)",
                    backgroundSize: "300% 300%",
                }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                aria-hidden
                className="pointer-events-none absolute -left-32 -top-24 w-64 h-64 rounded-full opacity-25 blur-3xl"
                style={{ background: "#60a5fa" }}
                animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                aria-hidden
                className="pointer-events-none absolute -right-32 -bottom-24 w-72 h-72 rounded-full opacity-22 blur-2xl"
                style={{ background: "#93c5fd" }}
                animate={{ x: [0, -20, 0], y: [0, 10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                initial={{ scale: 0.98, y: 10, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-[min(720px,92%)] max-w-3xl rounded-2xl bg-white shadow-xl p-8 border border-slate-100"
                role="status"
                aria-live="polite"
            >
                <div className="flex items-center gap-6">
                    <motion.div
                        className="flex items-center justify-center w-28 h-28 rounded-xl bg-gradient-to-br from-white to-slate-50 border border-slate-100"
                        animate={{ rotate: [0, 360] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                    >
                        <svg
                            className="w-16 h-16 text-blue-600"
                            viewBox="0 0 50 50"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                cx="25"
                                cy="25"
                                r="20"
                                stroke="currentColor"
                                strokeWidth="3"
                                opacity="0.12"
                            />
                            <path
                                d="M45 25a20 20 0 0 0-7.5-15"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                style={{ strokeDasharray: 60, strokeDashoffset: 0 }}
                            />
                        </svg>
                    </motion.div>

                    {/* Text block */}
                    <div className="flex-1">
                        <motion.h2
                            initial={{ y: 6, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.12 }}
                            className="text-2xl font-semibold text-slate-900"
                        >
                            {message}
                            <span className="text-blue-500">.</span>
                        </motion.h2>

                        <motion.p
                            initial={{ y: 6, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.18 }}
                            className="mt-2 text-sm text-slate-600"
                        >
                            {subtitle}
                        </motion.p>

                        {/* animated dots */}
                        <div className="mt-4 flex items-center gap-2">
                            {[0, 1, 2].map((i) => (
                                <motion.span
                                    key={i}
                                    className="inline-block w-3 h-3 rounded-full bg-blue-600"
                                    animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
                                    transition={{ delay: 0.2 + i * 0.08, duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
                                />
                            ))}

                            <motion.span className="ml-3 text-xs text-slate-500">Connecting…</motion.span>
                        </div>

                        {/* subtle progress bar */}
                        <div className="mt-6 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400"
                                initial={{ x: "-100%" }}
                                animate={{ x: ["-100%", "50%", "100%"] }}
                                transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                                style={{ width: "40%" }}
                            />
                        </div>
                    </div>
                </div>

                {/* aria text for screen readers */}
                <span className="sr-only">{message} — {subtitle}</span>
            </motion.div>
        </motion.div>
    );
}
