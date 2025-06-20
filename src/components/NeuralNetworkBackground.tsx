import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';  // ⬅️ scoped React wrapper
import * as THREE from 'three';

function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.BufferGeometry>(null);
  const linesGeometryRef = useRef<THREE.BufferGeometry>(null);
  const packetsRef = useRef<THREE.InstancedMesh>(null);
  const blinkTimes = useRef<{ [key: string]: number }>({});

  const maxParticleCount = 1000;
  const particleCount = 500;
  const r = 10;
  const rHalf = r / 2;
  const maxConnections = 20;
  const minDistance = 2.5;

  const segments = maxParticleCount * maxParticleCount;
  const positions = useMemo(() => new Float32Array(segments * 3), [segments]);
  const colors = useMemo(() => new Float32Array(segments * 3), [segments]);
  const particlePositions = useMemo(() => new Float32Array(maxParticleCount * 3), []);
  const particlesData = useMemo<{ velocity: THREE.Vector3; numConnections: number; }[]>(() => [], []);
  const v = useMemo(() => new THREE.Vector3(), []);

  const [activeConnections, setActiveConnections] = React.useState<{ from: number; to: number; t: number; speed: number; }[]>([]);
  const maxPackets = 100;

  useEffect(() => {
    for (let i = 0; i < maxParticleCount; i++) {
      const x = Math.random() * r - r / 2;
      const y = Math.random() * r - r / 2;
      const z = Math.random() * r - r / 2;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      const v = new THREE.Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, -1 + Math.random() * 2);
      particlesData.push({ velocity: v.normalize().divideScalar(50), numConnections: 0 });
    }
    if (particlesRef.current) {
      particlesRef.current.setDrawRange(0, particleCount);
    }
    // eslint-disable-next-line
  }, []);

  useFrame((_, delta) => {
    let vertexpos = 0;
    let colorpos = 0;
    let numConnected = 0;
    const newActiveConnections: { from: number; to: number; t: number; speed: number; }[] = [];
    const now = performance.now();

    for (let i = 0; i < particleCount; i++) particlesData[i].numConnections = 0;

    for (let i = 0; i < particleCount; i++) {
      const particleData = particlesData[i];

      v.set(particlePositions[i * 3], particlePositions[i * 3 + 1], particlePositions[i * 3 + 2])
        .add(particleData.velocity)
        .setLength(10);
      particlePositions[i * 3] = v.x;
      particlePositions[i * 3 + 1] = v.y;
      particlePositions[i * 3 + 2] = v.z;

      if (particlePositions[i * 3 + 1] < -rHalf || particlePositions[i * 3 + 1] > rHalf) particleData.velocity.y = -particleData.velocity.y;
      if (particlePositions[i * 3] < -rHalf || particlePositions[i * 3] > rHalf) particleData.velocity.x = -particleData.velocity.x;
      if (particlePositions[i * 3 + 2] < -rHalf || particlePositions[i * 3 + 2] > rHalf) particleData.velocity.z = -particleData.velocity.z;

      if (particleData.numConnections >= maxConnections) continue;

      for (let j = i + 1; j < particleCount; j++) {
        const particleDataB = particlesData[j];
        if (particleDataB.numConnections >= maxConnections) continue;

        const dx = particlePositions[i * 3] - particlePositions[j * 3];
        const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
        const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < minDistance) {
          particleData.numConnections++;
          particleDataB.numConnections++;

          if (Math.random() < 0.002 && newActiveConnections.length < maxPackets) {
            newActiveConnections.push({ from: i, to: j, t: 0, speed: 0.5 + Math.random() });
            blinkTimes.current[`${i}-${j}`] = now;
          }

          let alpha = 1.0 - dist / minDistance;
          const blinkKey = `${i}-${j}`;
          if (blinkTimes.current[blinkKey] && now - blinkTimes.current[blinkKey] < 200) {
            alpha = 1.0;
          }

          positions[vertexpos++] = particlePositions[i * 3];
          positions[vertexpos++] = particlePositions[i * 3 + 1];
          positions[vertexpos++] = particlePositions[i * 3 + 2];

          positions[vertexpos++] = particlePositions[j * 3];
          positions[vertexpos++] = particlePositions[j * 3 + 1];
          positions[vertexpos++] = particlePositions[j * 3 + 2];

          colors[colorpos++] = 0.2 + 0.8 * alpha;
          colors[colorpos++] = 0.5 * alpha;
          colors[colorpos++] = 1.0 * alpha;

          colors[colorpos++] = 0.2 + 0.8 * alpha;
          colors[colorpos++] = 0.5 * alpha;
          colors[colorpos++] = 1.0 * alpha;

          numConnected++;
        }
      }
    }

    setActiveConnections(prev => {
      const updated = prev
        .map(pkt => ({ ...pkt, t: pkt.t + delta * pkt.speed }))
        .filter(pkt => pkt.t < 1);
      return [...updated, ...newActiveConnections];
    });

    if (linesGeometryRef.current) {
      linesGeometryRef.current.setDrawRange(0, numConnected * 2);
      linesGeometryRef.current.attributes.position.needsUpdate = true;
      linesGeometryRef.current.attributes.color.needsUpdate = true;
    }
    if (particlesRef.current) {
      particlesRef.current.attributes.position.needsUpdate = true;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += delta / 5;
    }
  });

  const packetColor = new THREE.Color(0x00ffea);
  return (
    <>
      <group ref={groupRef} dispose={null}>
        <points>
          <bufferGeometry ref={particlesRef}>
            <bufferAttribute attach="attributes-position" count={particleCount} array={particlePositions} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial color={'white'} size={3} blending={THREE.AdditiveBlending} transparent={true} sizeAttenuation={false} />
        </points>
        <lineSegments>
          <bufferGeometry ref={linesGeometryRef}>
            <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
            <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial vertexColors={true} blending={THREE.AdditiveBlending} transparent={true} />
        </lineSegments>
        <instancedMesh ref={packetsRef} args={[undefined, undefined, maxPackets]}>
          <sphereGeometry args={[0.13, 8, 8]} />
          <meshBasicMaterial color={packetColor} transparent opacity={0.85} />
        </instancedMesh>
      </group>
      {activeConnections.length > 0 && (
        <PacketAnimator
          activeConnections={activeConnections}
          particlePositions={particlePositions}
          packetsRef={packetsRef}
        />
      )}
    </>
  );
}

function PacketAnimator({ activeConnections, particlePositions, packetsRef }: {
  activeConnections: { from: number; to: number; t: number; speed: number; }[];
  particlePositions: Float32Array;
  packetsRef: React.RefObject<THREE.InstancedMesh>;
}) {
  useFrame(() => {
    if (!packetsRef.current) return;
    activeConnections.forEach((pkt, i) => {
      const fromIdx = pkt.from * 3;
      const toIdx = pkt.to * 3;
      const from = new THREE.Vector3(
        particlePositions[fromIdx],
        particlePositions[fromIdx + 1],
        particlePositions[fromIdx + 2]
      );
      const to = new THREE.Vector3(
        particlePositions[toIdx],
        particlePositions[toIdx + 1],
        particlePositions[toIdx + 2]
      );
      const pos = from.clone().lerp(to, pkt.t);
      const mat = new THREE.Matrix4().setPosition(pos);
      packetsRef.current!.setMatrixAt(i, mat);
    });
    packetsRef.current.count = activeConnections.length;
    packetsRef.current.instanceMatrix.needsUpdate = true;
  });
  return null;
}

export const NeuralNetworkBackground: React.FC = () => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
      opacity: 0.18,
      filter: 'blur(0.5px)',
    }}
    aria-hidden="true"
  >
    <Canvas camera={{ position: [0, 0, 17.5] }}>
      <NeuralNetwork />
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
    </Canvas>
  </div>
); 