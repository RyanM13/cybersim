import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Blog7 = ({
  tagline = "Latest Updates",
  heading = "Blog",
  description = "Discover the latest trends, tips, and best practices in modern Cyber Security from like minded individuals.",

  posts = [
    {
      id: "post-2",
      title: "Understanding Brute Force Attacks in Real Systems",
      summary:
        "Explore how brute force attacks work against SSH and web logins, how to identify them in logs, and practical mitigation techniques like rate limiting and IP blocking.",
      label: "Security",
      author: "ChatGPT concept",
      published: "12 Feb 2024",
      url: "https://example.com/brute-force-attacks",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-2.svg",
    },
    {
      id: "post-3",
      title: "Reading System Logs: Detecting Suspicious Activity",
      summary:
        "Learn how to analyze system logs to detect anomalies, distinguish between normal traffic and malicious behavior, and identify early signs of an attack.",
      label: "Analysis",
      author: "ChatGPT concept",
      published: "5 Mar 2024",
      url: "https://example.com/log-analysis",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-3.svg",
    },
    {
      id: "post-4",
      title: "Firewall Fundamentals: Blocking Threats Effectively",
      summary:
        "A practical guide to configuring firewalls using tools like UFW. Understand rules, common mistakes, and how to properly secure your system against external threats.",
      label: "Guide",
      author: "ChatGPT concept",
      published: "20 Mar 2024",
      url: "https://example.com/firewall-fundamentals",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
    },
  ],

  className,
}) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto flex flex-col items-center justify-center gap-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-6">
            {tagline}
          </Badge>
          <h2 className="mb-3 text-5xl tracking-tighter text-pretty md:mb-4 lg:mb-6 lg:max-w-3xl lg:text-7xl">
            {heading}
          </h2>
          <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
            {description}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="grid grid-rows-[auto_auto_1fr_auto] overflow-hidden pt-0"
            >
              <div className="aspect-video w-full">
                <a
                  href={post.url}
                  target="_blank"
                  className="transition-opacity duration-200 fade-in hover:opacity-70"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover object-center"
                  />
                </a>
              </div>
              <CardHeader>
                <h3 className="text-xl hover:underline md:text-xl">
                  <a href={post.url} target="_blank">
                    {post.title}
                  </a>
                </h3>
                <p className="mt-2 text-sm font-semibold text-foreground/80">
                  {post.author} · {post.published}
                </p>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">
                  {post.summary}
                </p>
              </CardContent>
              <CardFooter>
                <a
                  href={post.url}
                  target="_blank"
                  className="flex items-center text-muted-foreground hover:underline"
                >
                  Read more
                  <ArrowRight className="ml-1 size-4" />
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Blog7 };
