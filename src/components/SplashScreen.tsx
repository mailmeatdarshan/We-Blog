import { useEffect, useState } from "react";

interface SplashScreenProps {
    onComplete: () => void;
    minimumDuration?: number;
}

export function SplashScreen({ onComplete, minimumDuration = 2000 }: SplashScreenProps) {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(onComplete, 500);
        }, minimumDuration);

        return () => clearTimeout(timer);
    }, [minimumDuration, onComplete]);

    return (
        <div
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"
                }`}
        >
            <div className="animate-pulse">
                <h1 className="text-5xl md:text-7xl font-bold font-gelasio text-foreground">
                    CA<span className="text-primary"> Monk</span>
                </h1>
            </div>

            <p className="mt-4 text-muted-foreground font-inter text-lg">
                Your gateway to wisdom
            </p>

            <div className="mt-12 flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-muted rounded-full" />
                    <div className="absolute inset-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <span className="text-sm text-muted-foreground font-inter animate-pulse">
                    Loading...
                </span>
            </div>
        </div>
    );
}
