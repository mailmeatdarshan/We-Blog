import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BlogList } from "./components/BlogList";
import { BlogDetail } from "./components/BlogDetail";
import { BlogForm } from "./components/BlogForm";
import { Button } from "./components/ui/button";
import { PenSquare, X } from "lucide-react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";
import { SplashScreen } from "./components/SplashScreen";
import { Navbar } from "./components/Navbar";
import { SearchBox } from "./components/SearchBox";
import { Footer } from "./components/Footer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function AppContent() {
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-10">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold font-gelasio text-foreground">
              We -<span className="text-primary"> Blog</span>
            </span>
          </a>
          <Navbar />
        </div>

        <div className="flex items-center gap-4">
          <SearchBox />
          <ThemeToggle />
          <Button
            onClick={() => setShowForm(!showForm)}
            className="gap-2 rounded-full px-6"
            variant={showForm ? "outline" : "default"}
          >
            {showForm ? (
              <>
                <X className="h-4 w-4" />
                Close
              </>
            ) : (
              <>
                <PenSquare className="h-4 w-4" />
                Write
              </>
            )}
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="mb-8 animate-in slide-in-from-top-2 duration-300">
            <BlogForm
              onSuccess={() => {
                setShowForm(false);
              }}
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-[380px] shrink-0">
            <div className="sticky top-24">
              <h2 className="text-xl font-medium font-inter mb-6 text-dark-grey">
                Latest Blogs
              </h2>
              <div className="max-h-[calc(100vh-12rem)] overflow-y-auto pr-2 space-y-6">
                <BlogList
                  selectedBlogId={selectedBlogId}
                  onSelectBlog={setSelectedBlogId}
                />
              </div>
            </div>
          </aside>

          <div className="hidden lg:block w-px bg-border" />

          <section className="flex-1 min-w-0">
            <BlogDetail blogId={selectedBlogId} />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
