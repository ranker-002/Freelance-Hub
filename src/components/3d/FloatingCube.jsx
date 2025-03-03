import React from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';

const FloatingCube = ({ position = [0, 0, 0], color = '#0ea5e9' }) => {
  const { scale } = useSpring({
    from: { scale: [1, 1, 1] },
    to: async (next) => {
      while (true) {
        await next({ scale: [1.2, 1.2, 1.2] });
        await next({ scale: [1, 1, 1] });
      }
    },
    config: { mass: 1, tension: 170, friction: 26 },
  });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    state.camera.position.y = Math.sin(time * 0.5) * 0.2;
  });

  return (
    <animated.mesh position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
    </animated.mesh>
  );
};

export default FloatingCube;