import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

export function SearchBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            return () => document.removeEventListener("keydown", handleEscape);
        }
    }, [isOpen]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
            >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search...</span>
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-xl px-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
                            <div className="flex items-center gap-3 p-4 border-b border-border">
                                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Start typing to search"
                                    className="flex-1 bg-transparent text-lg text-foreground placeholder:text-muted-foreground outline-none font-inter"
                                />
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-secondary rounded-md transition-colors"
                                >
                                    <X className="h-5 w-5 text-muted-foreground" />
                                </button>
                            </div>

                            <div className="p-6 min-h-[150px] flex items-center justify-center">
                                {query ? (
                                    <p className="text-muted-foreground text-sm">
                                        No results found for "{query}"
                                    </p>
                                ) : (
                                    <p className="text-muted-foreground text-sm">
                                        Type to start searching
                                    </p>
                                )}
                            </div>

                            <div className="px-4 py-3 bg-secondary/50 border-t border-border">
                                <p className="text-xs text-muted-foreground text-center font-inter">
                                    Search for tags, people, articles, and more
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
