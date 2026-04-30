"use client";

const items = [
  "OpenAI",
  "Anthropic",
  "Llama 3.2",
  "RAG",
  "Chroma",
  "FAISS",
  "YOLOv8",
  "Hailo-8 NPU",
  "GStreamer",
  "AWS",
  "Python",
  "React",
  "TypeScript",
  "MITRE ATT&CK",
  "Zero Trust",
  "MLOps",
];

export function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div className="relative border-y border-border bg-background py-6 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10"
      />
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10"
      />

      <div className="flex gap-12 whitespace-nowrap animate-marquee">
        {doubled.map((item, i) => (
          <div
            key={`${item}-${i}`}
            className="inline-flex items-center gap-3 text-sm font-mono text-muted"
          >
            <span className="size-1 rounded-full bg-accent/60" />
            <span className="hover:text-foreground transition-colors">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
