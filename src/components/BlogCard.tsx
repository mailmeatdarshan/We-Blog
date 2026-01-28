import type { Blog } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock } from "lucide-react";
import { calculateReadingTime } from "@/lib/readingTime";

interface BlogCardProps {
    blog: Blog;
    isSelected: boolean;
    onClick: () => void;
}

export function BlogCard({ blog, isSelected, onClick }: BlogCardProps) {
    const formattedDate = new Date(blog.date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
    });

    return (
        <div
            className={`flex gap-4 p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-secondary/50 ${isSelected ? "bg-secondary border-l-4 border-primary" : ""
                }`}
            onClick={onClick}
        >
            <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-muted">
                <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                    }}
                />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-1.5 mb-2">
                    {blog.category.slice(0, 2).map((cat) => (
                        <Badge
                            key={cat}
                            variant="secondary"
                            className="text-xs font-medium bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                            {cat}
                        </Badge>
                    ))}
                </div>

                <h3 className="font-gelasio font-medium text-lg leading-tight line-clamp-2 text-foreground mb-1">
                    {blog.title}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-1 font-inter">
                    {blog.description}
                </p>

                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground font-inter">
                    <span>{formattedDate}</span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {calculateReadingTime(blog.content)} min read
                    </span>
                    <span className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5" />
                        {Math.floor(Math.random() * 100)}
                    </span>
                </div>
            </div>
        </div>
    );
}
