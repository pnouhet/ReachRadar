import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PlayerBar } from "@/components/player/PlayerBar";
import { PlayerProvider, TrackQueue } from "@/components/player/PlayerProvider";
import { PlayButton } from "@/components/tracks/PlayButton";
import { closePlayer } from "@/lib/player/store";

vi.mock("@/lib/tracks/actions", () => ({
  getTrackAudioUrl: vi.fn(async (id: string) => `https://cdn.test/${id}.mp3`),
}));

const TRACKS = [
  { id: "a", title: "Afterlight", artist: "Nova Kane", coverUrl: null },
  { id: "b", title: "Low Tide", artist: "Nova Kane", coverUrl: null },
];

function App() {
  return (
    <PlayerProvider>
      <TrackQueue tracks={TRACKS}>
        {TRACKS.map((t) => (
          <PlayButton key={t.id} trackId={t.id} title={t.title} artist={t.artist} />
        ))}
      </TrackQueue>
      <PlayerBar />
    </PlayerProvider>
  );
}

const bar = () => screen.getByRole("region", { name: "Audio player" });

beforeEach(() => {
  // jsdom has no media playback: make play() succeed and report it like a browser would.
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(async function (this: HTMLMediaElement) {
    this.dispatchEvent(new Event("playing"));
  });
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.documentElement.style.removeProperty("--player-h");
});

describe("PlayerBar", () => {
  it("stays hidden until a track is started", () => {
    render(<App />);
    expect(screen.queryByRole("region", { name: "Audio player" })).not.toBeInTheDocument();
  });

  it("shows the track, its artist and every control once a card's play button is pressed", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Play Afterlight" }));
    const player = within(bar());
    expect(await player.findByRole("button", { name: "Pause" })).toBeInTheDocument();
    expect(player.getByText("Afterlight")).toBeInTheDocument();
    expect(player.getByText("Nova Kane")).toBeInTheDocument();
    for (const name of ["Previous track", "Next track", "Mute", "Close player"]) {
      expect(player.getByRole("button", { name })).toBeInTheDocument();
    }
    expect(player.getByRole("slider", { name: "Seek" })).toBeInTheDocument();
    expect(player.getByRole("slider", { name: "Volume" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pause Afterlight" })).toHaveAttribute("data-state", "playing");
    expect(document.documentElement.style.getPropertyValue("--player-h")).not.toBe("");
  });

  it("next moves to the following track of the list and is disabled on the last", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Play Afterlight" }));
    const player = within(bar());
    const next = player.getByRole("button", { name: "Next track" });
    expect(next).toBeEnabled();
    await userEvent.click(next);
    expect(await screen.findByRole("button", { name: "Pause Low Tide" })).toBeInTheDocument();
    expect(player.getByText("Low Tide")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play Afterlight" })).toHaveAttribute("data-state", "idle");
    expect(next).toBeDisabled();
  });

  it("mute toggles its label and pressed state", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Play Afterlight" }));
    const player = within(bar());
    await userEvent.click(player.getByRole("button", { name: "Mute" }));
    expect(player.getByRole("button", { name: "Unmute" })).toHaveAttribute("aria-pressed", "true");
    expect(player.getByRole("slider", { name: "Volume" })).toHaveValue("0");
  });

  it("closes from its own button and from the sign-out signal", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Play Afterlight" }));
    await userEvent.click(within(bar()).getByRole("button", { name: "Close player" }));
    expect(screen.queryByRole("region", { name: "Audio player" })).not.toBeInTheDocument();
    expect(document.documentElement.style.getPropertyValue("--player-h")).toBe("");

    await userEvent.click(screen.getByRole("button", { name: "Play Low Tide" }));
    expect(bar()).toBeInTheDocument();
    closePlayer();
    expect(await screen.findByRole("button", { name: "Play Low Tide" })).toHaveAttribute("data-state", "idle");
    expect(screen.queryByRole("region", { name: "Audio player" })).not.toBeInTheDocument();
  });
});
