import type { Blog, CreateBlogInput } from "@/types/blog";

const API_BASE_URL = "http://localhost:3001";

export async function getBlogs(): Promise<Blog[]> {
    const response = await fetch(`${API_BASE_URL}/blogs`);
    if (!response.ok) {
        throw new Error("Failed to fetch blogs");
    }
    return response.json();
}

const BLOGS_PER_PAGE = 5;

export async function getBlogsPaginated(page: number): Promise<{
    blogs: Blog[];
    nextPage: number | undefined;
}> {
    const response = await fetch(
        `${API_BASE_URL}/blogs?_page=${page}&_per_page=${BLOGS_PER_PAGE}`
    );
    if (!response.ok) {
        throw new Error("Failed to fetch blogs");
    }
    const data = await response.json();
    const blogs: Blog[] = data.data || data;
    const totalPages = data.pages || 1;
    return {
        blogs,
        nextPage: page < totalPages ? page + 1 : undefined,
    };
}

export async function getBlogById(id: number): Promise<Blog> {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch blog");
    }
    return response.json();
}

export async function createBlog(data: CreateBlogInput): Promise<Blog> {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...data,
            date: new Date().toISOString(),
        }),
    });
    if (!response.ok) {
        throw new Error("Failed to create blog");
    }
    return response.json();
}
