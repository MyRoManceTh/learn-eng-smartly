import { useState, useCallback, useRef, useEffect } from "react";
import type { ClassroomZone, CharacterPose, ZoneId, ZoneSpeech } from "@/types/classroom";
import {
  IDLE_SPEECHES,
  GREETING_SPEECHES,
  getZoneById,
} from "@/data/classroomZones";

export interface UseClassroomNavigationReturn {
  charX: number;
  isWalking: boolean;
  direction: "left" | "right";
  currentPose: CharacterPose;
  speech: ZoneSpeech | null;
  activeZone: ZoneId | null;
  walkDuration: number;
  navigateToZone: (zoneId: ZoneId) => void;
  handleFloorClick: (
    e: React.MouseEvent<HTMLDivElement>,
    roomRef: React.RefObject<HTMLDivElement | null>,
  ) => void;
  handleTransitionEnd: (e: React.TransitionEvent<HTMLDivElement>) => void;
}

export function useClassroomNavigation(
  onZoneNavigate?: (route: string) => void,
): UseClassroomNavigationReturn {
  const [charX, setCharX] = useState(50);
  const [isWalking, setIsWalking] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [currentPose, setCurrentPose] = useState<CharacterPose>("idle");
  const [speech, setSpeech] = useState<ZoneSpeech | null>(null);
  const [activeZone, setActiveZone] = useState<ZoneId | null>(null);
  const [walkDuration, setWalkDuration] = useState(0.5);

  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const targetZoneRef = useRef<ClassroomZone | null>(null);
  const charXRef = useRef(charX);
  charXRef.current = charX;

  // Greeting on mount
  useEffect(() => {
    const greeting =
      GREETING_SPEECHES[Math.floor(Math.random() * GREETING_SPEECHES.length)];
    setSpeech(greeting);
    const timer = setTimeout(() => setSpeech(null), 3500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-idle walk after 8 seconds of no interaction
  useEffect(() => {
    const startAutoWalk = () => {
      autoTimer.current = setTimeout(() => {
        if (targetZoneRef.current) return;
        const target = 20 + Math.random() * 60;
        const cx = charXRef.current;
        const distance = Math.abs(target - cx);
        const duration = Math.max(1.5, Math.min(3.5, distance * 0.04));

        setDirection(target > cx ? "right" : "left");
        setWalkDuration(duration);
        setCurrentPose("walking");
        setIsWalking(true);
        setCharX(target);

        navigateTimer.current = setTimeout(() => {
          setIsWalking(false);
          setCurrentPose("idle");
          // Sometimes show idle speech
          if (Math.random() < 0.4) {
            const idleSpeech =
              IDLE_SPEECHES[Math.floor(Math.random() * IDLE_SPEECHES.length)];
            setSpeech(idleSpeech);
            setTimeout(() => setSpeech(null), 3500);
          }
          startAutoWalk();
        }, duration * 1000 + 2000 + Math.random() * 3000);
      }, 8000 + Math.random() * 4000);
    };

    startAutoWalk();
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
      if (navigateTimer.current) clearTimeout(navigateTimer.current);
    };
  }, []);

  const clearTimers = useCallback(() => {
    if (autoTimer.current) clearTimeout(autoTimer.current);
    if (navigateTimer.current) clearTimeout(navigateTimer.current);
    autoTimer.current = null;
    navigateTimer.current = null;
  }, []);

  const navigateToZone = useCallback(
    (zoneId: ZoneId) => {
      const zone = getZoneById(zoneId);
      if (!zone) return;

      clearTimers();
      targetZoneRef.current = zone;
      setActiveZone(zoneId);

      const target = zone.position.x;
      const cx = charXRef.current;
      const distance = Math.abs(target - cx);
      const duration = Math.max(0.5, Math.min(2.5, distance * 0.03));

      setDirection(target > cx ? "right" : "left");
      setWalkDuration(duration);
      setCurrentPose("walking");
      setIsWalking(true);
      setCharX(target);
    },
    [clearTimers],
  );

  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName !== "left") return;
      setIsWalking(false);

      const zone = targetZoneRef.current;
      if (zone) {
        // Arrived at zone — change pose + show speech
        setCurrentPose(zone.characterPose);
        const randomSpeech =
          zone.speeches[Math.floor(Math.random() * zone.speeches.length)];
        setSpeech(randomSpeech);

        navigateTimer.current = setTimeout(() => {
          setSpeech(null);
          onZoneNavigate?.(zone.route);
          targetZoneRef.current = null;
          setActiveZone(null);
          setTimeout(() => setCurrentPose("idle"), 500);
        }, 1500);
      } else {
        setCurrentPose("idle");
      }
    },
    [onZoneNavigate],
  );

  const handleFloorClick = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement>,
      roomRef: React.RefObject<HTMLDivElement | null>,
    ) => {
      if (!roomRef.current) return;
      const rect = roomRef.current.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const floorTop = rect.height * 0.5;
      if (clickY < floorTop) return;

      clearTimers();
      targetZoneRef.current = null;
      setActiveZone(null);

      const clickX = e.clientX - rect.left;
      const cx = charXRef.current;
      const targetPercent = Math.max(
        10,
        Math.min(90, (clickX / rect.width) * 100),
      );
      const distance = Math.abs(targetPercent - cx);

      setDirection(targetPercent > cx ? "right" : "left");
      setWalkDuration(Math.max(0.3, Math.min(2.0, distance * 0.025)));
      setCurrentPose("walking");
      setIsWalking(true);
      setCharX(targetPercent);
    },
    [clearTimers],
  );

  return {
    charX,
    isWalking,
    direction,
    currentPose,
    speech,
    activeZone,
    walkDuration,
    navigateToZone,
    handleFloorClick,
    handleTransitionEnd,
  };
}
