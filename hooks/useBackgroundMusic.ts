"use client";

import { useEffect, useState } from "react";

let audioInstance: HTMLAudioElement | null = null;
let currentSrc: string | null = null;
let playingState = false;
let hasAttemptedAutoplay = false;
const listeners = new Set<(playing: boolean) => void>();

function ensureAudio(src: string) {
  if (!audioInstance || currentSrc !== src) {
    audioInstance?.pause();
    audioInstance = new Audio(src);
    audioInstance.loop = true;
    audioInstance.volume = 0.35;
    currentSrc = src;
  }
  return audioInstance;
}

function notify(playing: boolean) {
  playingState = playing;
  listeners.forEach((listener) => listener(playing));
}

function play(src: string) {
  if (playingState) return;
  ensureAudio(src)
    .play()
    .then(() => notify(true))
    .catch(() => undefined);
}

function pause() {
  audioInstance?.pause();
  notify(false);
}

export function useBackgroundMusic(src: string) {
  const [isPlaying, setIsPlaying] = useState(playingState);

  useEffect(() => {
    setIsPlaying(playingState);
    listeners.add(setIsPlaying);
    return () => {
      listeners.delete(setIsPlaying);
    };
  }, []);

  const toggle = () => {
    if (playingState) {
      pause();
    } else {
      play(src);
    }
  };

  // Only ever attempts once across the whole app lifetime, so revisiting a
  // page that autoplays doesn't stop music already playing from another page.
  const attemptAutoplay = () => {
    if (hasAttemptedAutoplay) return;
    hasAttemptedAutoplay = true;
    play(src);
  };

  return { isPlaying, toggle, attemptAutoplay };
}
