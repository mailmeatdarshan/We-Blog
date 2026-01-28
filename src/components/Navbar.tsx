import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface NavDropdownProps {
    label: string;
    items: { label: string; href: string }[];
}

function NavDropdown({ label, items }: NavDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-inter text-sm">
                {label}
                <ChevronDown
                    className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 py-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                    {items.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
}

function NavLink({ href, children }: NavLinkProps) {
    return (
        <a
            href={href}
            className="text-muted-foreground hover:text-foreground transition-colors font-inter text-sm"
        >
            {children}
        </a>
    );
}

export function Navbar() {
    const productItems = [
        { label: "Blog Editor", href: "#" },
        { label: "Analytics", href: "#" },
        { label: "SEO Tools", href: "#" },
        { label: "API Access", href: "#" },
    ];

    const resourceItems = [
        { label: "Documentation", href: "#" },
        { label: "Tutorials", href: "#" },
        { label: "Support", href: "#" },
        { label: "Changelog", href: "#" },
    ];

    return (
        <div className="hidden md:flex items-center gap-8">
            <NavLink href="#">Home</NavLink>
            <NavLink href="#">Community</NavLink>
            <NavDropdown label="Products" items={productItems} />
            <NavDropdown label="Resources" items={resourceItems} />
        </div>
    );
}
