import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { getBlogs, getBlogById, createBlog, getBlogsPaginated } from "@/lib/api";
import type { CreateBlogInput } from "@/types/blog";

export function useBlogs() {
    return useQuery({
        queryKey: ["blogs"],
        queryFn: getBlogs,
    });
}

export function useInfiniteBlogs() {
    return useInfiniteQuery({
        queryKey: ["blogs", "infinite"],
        queryFn: ({ pageParam }) => getBlogsPaginated(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });
}

export function useBlog(id: number | null) {
    return useQuery({
        queryKey: ["blog", id],
        queryFn: () => getBlogById(id!),
        enabled: id !== null,
    });
}

export function useCreateBlog() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateBlogInput) => createBlog(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });
}
