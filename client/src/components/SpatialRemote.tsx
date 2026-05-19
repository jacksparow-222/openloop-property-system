import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { playConfirmSound, playDismissSound } from "../../../src/AudioHaptics";
// import { Html } from '@react-three/drei'; // For 3D HTML labels, install @react-three/drei if not present

// Button descriptors
const BUTTONS = [
  { label: "Call Waiter", key: "waiter" },
  { label: "Request Security", key: "security" },
  { label: "Tech Support", key: "tech" },
  { label: "Manager Assist", key: "manager" },
];
const OBSIDIAN = "#0d0b08";
const GOLD = "#D4A843";
const LOCK_TIME = 600; // seconds

function GyroControls({ setTilt }) {
  useEffect(() => {
    function handler(e) {
      const gamma = e.gamma || 0; // y axis
      const beta = e.beta || 0;   // x axis
      setTilt({ x: beta, y: gamma });
    }
    window.addEventListener("deviceorientation", handler, true);
    return () => window.removeEventListener("deviceorientation", handler);
  }, [setTilt]);
  return null;
}

function SignalPlane({
  position,
  rotation,
  label,
  onClick,
  goldEdge,
  disabled,
  emissive = GOLD,
}) {
  const mesh = useRef();
  useFrame(() => {
    if (mesh.current) mesh.current.material.emissiveIntensity = goldEdge ? 1 : 0.1;
  });
  return (
    <mesh
      position={position}
      rotation={rotation}
      ref={mesh}
      onClick={disabled ? undefined : onClick}
      castShadow
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <boxGeometry args={[2, 1, 0.2]} />
      <meshStandardMaterial
        color={"#181718"}
        roughness={0.8}
        metalness={0.1}
        emissive={emissive}
        emissiveIntensity={goldEdge ? 1 : 0.15}
      />
      {/* Label as simple 3D text fallback (delete if @react-three/drei/Html is available): */}
      {/* To get luxury HTML-style labels, ask a developer to enable @react-three/drei and <Html center> here. */}
    </mesh>
  );
}

export default function SpatialRemote() {
  // State
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [gate, setGate] = useState({ open: false, for: null });
  const [waiterLocked, setWaiterLocked] = useState(false);
  const [waiterCountdown, setWaiterCountdown] = useState(0);

  // Waiter lock countdown handler
  useEffect(() => {
    let timer;
    if (waiterLocked && waiterCountdown > 0) {
      timer = setTimeout(() => setWaiterCountdown(waiterCountdown - 1), 1000);
    } else if (waiterCountdown === 0 && waiterLocked) {
      setWaiterLocked(false);
    }
    return () => clearTimeout(timer);
  }, [waiterLocked, waiterCountdown]);

  // Button event logic
  function handleButton(btn) {
    if (btn === "waiter") {
      setWaiterLocked(true);
      setWaiterCountdown(LOCK_TIME);
      playConfirmSound();
      return;
    }
    setGate({ open: true, for: btn });
  }
  function handleConfirm() {
    playConfirmSound();
    setGate({ open: false, for: null });
  }
  function handleDismiss() {
    playDismissSound();
    setGate({ open: false, for: null });
  }
  // Plane positions
  const spacing = 2.2;
  const baseY = 0;
  const buttonPositions = [
    [-spacing, baseY, 0], // Waiter
    [0, baseY, 0],        // Security
    [spacing, baseY, 0],  // Tech
    [2 * spacing, baseY, 0], // Manager
  ];

  return (
    <div style={{ width: "100vw", height: "100vh", background: OBSIDIAN, position: 'relative' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [5, 5, 13], fov: 50 }}
        style={{ background: OBSIDIAN }}
      >
        <ambientLight intensity={0.28} />
        <directionalLight
          color={GOLD}
          position={[5, 13, 10]}
          intensity={1}
          castShadow
        />
        <GyroControls setTilt={setTilt} />
        {BUTTONS.map((b, i) => (
          <SignalPlane
            key={b.key}
            position={buttonPositions[i]}
            rotation={[
              THREE.MathUtils.degToRad(tilt.x / 8),
              THREE.MathUtils.degToRad(tilt.y / 8),
              0,
            ]}
            label={
              b.key === "waiter" && waiterLocked
                ? `Waiter (${Math.floor(waiterCountdown / 60)}:${String(waiterCountdown % 60).padStart(2, "0")})`
                : b.label
            }
            onClick={() => !waiterLocked && handleButton(b.key)}
            goldEdge={b.key === "waiter" ? !waiterLocked || waiterCountdown === 0 : true}
            disabled={b.key === "waiter" ? waiterLocked : false}
            emissive={GOLD}
          />
        ))}
      </Canvas>
      {/* Blur and overlays for friction gate */}
      {gate.open && (
        <>
          <div style={{
            position: "absolute",
            top: 0, left: 0, width: "100vw", height: "100vh",
            backdropFilter: "blur(7px)",
            background: "#0d0b08d8",
            zIndex: 2,
          }} />
          <div style={{
            position: "absolute", zIndex: 3, top: "48%", left: "0", width: "100vw", display: "flex", justifyContent: "center", gap: "3rem"
          }}>
            <button
              onClick={handleDismiss}
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "white",
                borderRadius: "6px",
                border: `2px solid #F44336`,
                background: "#B71C1C",
                padding: "1.2rem 2.5rem",
                boxShadow: "0 0 40px 8px #a4061d66",
                textShadow: "0 0 24px #F44336",
                cursor: "pointer"
              }}
            >
              Dismiss
            </button>
            <button
              onClick={handleConfirm}
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "white",
                borderRadius: "6px",
                border: `2px solid #21E857`,
                background: "#21E857",
                padding: "1.2rem 2.5rem",
                boxShadow: "0 0 40px 8px #1ea43b70",
                textShadow: "0 0 24px #21E857",
                cursor: "pointer"
              }}
            >
              Confirm
            </button>
          </div>
        </>
      )}
    </div>
  );
}
