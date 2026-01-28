import { useState } from "react";
import { useBlog } from "@/hooks/useBlogs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar, AlertCircle, RefreshCw, FileText, Heart, MessageCircle, Clock, Bookmark, Share2, User } from "lucide-react";
import { calculateReadingTime } from "@/lib/readingTime";

interface BlogDetailProps {
    blogId: number | null;
}

function BlogDetailSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="w-full aspect-video rounded-xl" />
            <div className="space-y-4">
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-5 w-48" />
                <div className="space-y-3 pt-6 border-t">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        </div>
    );
}

export function BlogDetail({ blogId }: BlogDetailProps) {
    const { data: blog, isLoading, isError, error, refetch } = useBlog(blogId);
    const [isBookmarked, setIsBookmarked] = useState(false);

    const handleShare = async () => {
        if (!blog) return;

        const shareData = {
            title: blog.title,
            text: blog.description,
            url: `${window.location.origin}/blog/${blog.id}`,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.log("Share failed", err);
        }
    };

    if (blogId === null) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <FileText className="h-20 w-20 text-muted-foreground/30 mb-6" />
                <h3 className="text-2xl font-gelasio font-medium text-muted-foreground mb-2">
                    No blog selected
                </h3>
                <p className="text-muted-foreground font-inter">
                    Select a blog from the list to read its content
                </p>
            </div>
        );
    }

    if (isLoading) {
        return <BlogDetailSkeleton />;
    }

    if (isError) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-2">Error Loading Blog</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    {error?.message || "Something went wrong"}
                </p>
                <Button variant="outline" onClick={() => refetch()} className="gap-2 rounded-full">
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </Button>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Blog not found</p>
            </div>
        );
    }

    const formattedDate = new Date(blog.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <article className="max-w-3xl">
            <div className="relative overflow-hidden rounded-xl aspect-video bg-muted mb-8">
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

            <div className="space-y-4 mb-8">
                <div className="flex flex-wrap gap-2">
                    {blog.category.map((cat) => (
                        <Badge
                            key={cat}
                            className="rounded-full px-4 py-1 text-sm font-medium bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                            {cat}
                        </Badge>
                    ))}
                </div>

                <h1 className="text-4xl lg:text-5xl font-gelasio font-bold leading-tight text-foreground">
                    {blog.title}
                </h1>

                <div className="flex items-center gap-6 text-muted-foreground font-inter">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={blog.date}>{formattedDate}</time>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{calculateReadingTime(blog.content)} min read</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <Heart className="h-4 w-4" />
                            {Math.floor(Math.random() * 100)}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <MessageCircle className="h-4 w-4" />
                            {Math.floor(Math.random() * 20)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {blog.author?.avatar ? (
                            <img
                                src={blog.author.avatar}
                                alt={blog.author.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="h-6 w-6 text-primary" />
                        )}
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-inter">Written by</p>
                        <p className="font-gelasio font-semibold text-foreground">
                            {blog.author?.name || "CA Monk Team"}
                        </p>
                        {(blog.author?.bio || !blog.author) && (
                            <p className="text-sm text-muted-foreground font-inter mt-1">
                                {blog.author?.bio || "Passionate about sharing knowledge and insights with our community."}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <p className="text-xl text-muted-foreground font-inter leading-relaxed mb-8 pb-8 border-b border-border">
                {blog.description}
            </p>

            <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-foreground/90 leading-[1.8] font-inter text-lg">
                    {blog.content}
                </div>
            </div>

            <div className="flex items-center gap-4 mt-12 pt-8 border-t border-border">
                <Button variant="outline" className="gap-2 rounded-full">
                    <Heart className="h-4 w-4" />
                    Like
                </Button>
                <Button variant="outline" className="gap-2 rounded-full">
                    <MessageCircle className="h-4 w-4" />
                    Comment
                </Button>
                <Button
                    variant="outline"
                    className="gap-2 rounded-full"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-primary text-primary" : ""}`} />
                    {isBookmarked ? "Bookmarked" : "Bookmark"}
                </Button>
                <Button
                    variant="outline"
                    className="gap-2 rounded-full"
                    onClick={handleShare}
                >
                    <Share2 className="h-4 w-4" />
                    Share
                </Button>
            </div>
        </article>
    );
}
