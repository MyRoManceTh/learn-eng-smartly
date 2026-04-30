import { useState } from "react";
import StoryCollection from "@/components/library/StoryCollection";
import StoryReader from "@/components/library/StoryReader";
import { Story } from "@/data/storyCollection";

const LibraryPage = () => {
  const [selected, setSelected] = useState<Story | null>(null);

  if (selected) {
    return <StoryReader story={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50 pb-24">
      <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold font-thai">📚 คลังนิทาน</h1>
          <p className="text-xs font-thai text-muted-foreground">อ่านทีละบท สะสมเป็นการ์ดของคุณ</p>
        </div>
      </header>
      <main className="px-3 sm:px-4 py-4 max-w-6xl mx-auto">
        <StoryCollection onOpen={setSelected} />
      </main>
    </div>
  );
};

export default LibraryPage;
