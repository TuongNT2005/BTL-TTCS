import {cn} from "../../../util"


const variants = {
    display: "text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight",
    title: "text-4xl md:text-5xl font-bold tracking-tight",
    subtitle: "text-3xl md:text-4xl font-semibold tracking-tight",
    heading: "text-2xl md:text-3xl font-semibold",
    subheading: "text-xl md: text-2xl font-medium",
    lead: "text-xl md:text-2xl text-muted-foreground leading-relaxed",
    body: "text-base md:text-xl leading-relaxed",
    bodyLg: "text-lg md:text-base leading-relaxed",
    small: "text-sm md:text-lg text-muted-foreground",
    label: "text-sm md:text-lg font-medium text-foreground/80",
    muted: "text-sm md:text-lg text-muted-foreground",
    overline: "text-xs md:text-sm uppercase tracking-wider font-medium text-muted-foreground",
    mono: "font-mono text-sm md:text-xs",
};

export default function Text({variant = "body", className, id, children}) {
    const Comp =
        variant === "display" || variant === "title" ? "h1" :
            variant === "subtitle" || variant === "heading" ? "h2" :
                variant === "subheading" ? "h3" : "p";

    return (
        <Comp  className={cn("line-clamp-3 md:line-clamp-2 px-2 py-1", variants[variant], className)}
               id={id} > 
            {children}
        </Comp>
    );

}