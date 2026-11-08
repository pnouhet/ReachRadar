"use client";

import { useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { Switch } from "@/components/ui/Switch";

export function DemoControls() {
  const [on, setOn] = useState(true);
  const [genres, setGenres] = useState<string[]>(["House"]);
  const toggle = (g: string) => setGenres((cur) => (cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g]));
  return (
    <div className="flex flex-wrap items-center gap-6">
      {["House", "Melodic techno", "Drum & bass"].map((g) => (
        <Chip key={g} active={genres.includes(g)} onClick={() => toggle(g)}>
          {g}
        </Chip>
      ))}
      <Switch label="Open to collabs" checked={on} onChange={setOn} />
      <Switch label="Verified only" checked={!on} onChange={(v) => setOn(!v)} />
    </div>
  );
}
