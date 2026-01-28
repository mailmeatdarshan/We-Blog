import { useState } from "react";
import { useCreateBlog } from "@/hooks/useBlogs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, CheckCircle, Image } from "lucide-react";

interface BlogFormProps {
    onSuccess?: () => void;
}

export function BlogForm({ onSuccess }: BlogFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [categoryInput, setCategoryInput] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);

    const createBlog = useCreateBlog();

    const addCategory = () => {
        const trimmed = categoryInput.trim().toUpperCase();
        if (trimmed && !categories.includes(trimmed)) {
            setCategories([...categories, trimmed]);
            setCategoryInput("");
        }
    };

    const removeCategory = (cat: string) => {
        setCategories(categories.filter((c) => c !== cat));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addCategory();
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setContent("");
        setCoverImage("");
        setCategories([]);
        setCategoryInput("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim() || !content.trim()) {
            return;
        }

        try {
            await createBlog.mutateAsync({
                title: title.trim(),
                description: description.trim(),
                content: content.trim(),
                coverImage: coverImage.trim() || "https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg",
                category: categories.length > 0 ? categories : ["GENERAL"],
            });

            setShowSuccess(true);
            resetForm();
            onSuccess?.();

            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error("Failed to create blog:", error);
        }
    };

    return (
        <div className="bg-background border border-border rounded-xl p-6 lg:p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-gelasio font-bold mb-6 text-foreground">
                Create New Blog
            </h2>

            {showSuccess && (
                <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-inter">Blog published successfully!</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Cover Image Preview */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground font-inter">
                        Cover Image
                    </label>
                    <div className="relative">
                        {coverImage ? (
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                                <img
                                    src={coverImage}
                                    alt="Cover preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = "none";
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setCoverImage("")}
                                    className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="aspect-video rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors">
                                <Image className="h-12 w-12 mb-3 opacity-50" />
                                <span className="text-sm font-inter">Enter image URL below</span>
                            </div>
                        )}
                    </div>
                    <Input
                        placeholder="https://example.com/image.jpg"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        type="url"
                        className="rounded-lg font-inter"
                    />
                </div>

                {/* Title */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground font-inter">
                        Title *
                    </label>
                    <Input
                        placeholder="Blog Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-xl font-gelasio h-14 rounded-lg"
                        required
                    />
                </div>

                {/* Description */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground font-inter">
                        Short Description *
                    </label>
                    <Textarea
                        placeholder="Brief description of your blog..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        className="rounded-lg font-inter resize-none"
                        required
                    />
                </div>

                {/* Categories */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground font-inter">
                        Topics
                    </label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add topic (e.g., Tech, Finance)"
                            value={categoryInput}
                            onChange={(e) => setCategoryInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="rounded-lg font-inter"
                        />
                        <Button type="button" variant="secondary" onClick={addCategory} className="rounded-lg shrink-0">
                            Add
                        </Button>
                    </div>
                    {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <Badge
                                    key={cat}
                                    className="rounded-full px-3 py-1 gap-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                >
                                    {cat}
                                    <button
                                        type="button"
                                        onClick={() => removeCategory(cat)}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground font-inter">
                        Content *
                    </label>
                    <Textarea
                        placeholder="Write your blog content here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={12}
                        className="rounded-lg font-inter resize-none leading-relaxed"
                        required
                    />
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full h-12 rounded-full text-base font-medium"
                    disabled={createBlog.isPending}
                >
                    {createBlog.isPending ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Publishing...
                        </>
                    ) : (
                        "Publish Blog"
                    )}
                </Button>
            </form>
        </div>
    );
}
