import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "E-commerce Template" },
      { name: "description", content: "E-commerce Template" },
      { property: "og:title", content: "E-commerce Template" },
      { property: "og:description", content: "E-commerce Template" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <h1 className="text-3xl font-semibold text-foreground">E-commerce Template</h1>
    </main>
  );
}
