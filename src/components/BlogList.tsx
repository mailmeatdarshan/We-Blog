import { useEffect, useRef } from "react";
import { useInfiniteBlogs } from "@/hooks/useBlogs";
import { BlogCard } from "./BlogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, FileText, Loader2 } from "lucide-react";

interface BlogListProps {
    selectedBlogId: number | null;
    onSelectBlog: (id: number) => void;
}

function BlogCardSkeleton() {
    return (
        <div className="flex gap-4 p-4">
            <Skeleton className="w-24 h-24 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                    <Skeleton className="h-5 w-14 rounded-full" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                </div>
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-24" />
            </div>
        </div>
    );
}

export function BlogList({ selectedBlogId, onSelectBlog }: BlogListProps) {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteBlogs();

    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <BlogCardSkeleton />
                <BlogCardSkeleton />
                <BlogCardSkeleton />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-2">Error Loading Blogs</h3>
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

    const blogs = data?.pages.flatMap((page) => page.blogs) ?? [];

    if (blogs.length === 0) {
        return (
            <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground">
                    No blogs yet. Be the first to write!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {blogs.map((blog) => (
                <BlogCard
                    key={blog.id}
                    blog={blog}
                    isSelected={blog.id === selectedBlogId}
                    onClick={() => onSelectBlog(blog.id)}
                />
            ))}

            <div ref={loadMoreRef} className="py-4 flex justify-center">
                {isFetchingNextPage && (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                )}
                {!hasNextPage && blogs.length > 0 && (
                    <p className="text-sm text-muted-foreground">No more blogs to load</p>
                )}
            </div>
        </div>
    );
}
