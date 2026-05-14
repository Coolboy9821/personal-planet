import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

// Earth component (no changes here)
const Earth = () => {
  const [dayMap, nightMap, normalMap] = useLoader(TextureLoader, [
    '/textures/earth_day.jpg',
    '/textures/earth_night.jpg',
    '/textures/earth_normal.jpg'
  ]);
  const earthRef = useRef();
  useFrame(({ clock }) => {
    earthRef.current.rotation.y = clock.getElapsedTime() * 0.1;
  });
  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        map={dayMap}
        normalMap={normalMap}
        metalness={0.4}
        roughness={0.7}
      />
      <meshStandardMaterial
        map={nightMap}
        blending={THREE.AdditiveBlending}
        opacity={0.9}
      />
    </mesh>
  );
};

// Clouds component (no changes here)
const Clouds = () => {
    const [cloudMap] = useLoader(TextureLoader, ['/textures/earth_clouds.jpg']);
    const cloudRef = useRef();
    useFrame(({ clock }) => {
        cloudRef.current.rotation.y = clock.getElapsedTime() * 0.12;
    });
    return (
        <mesh ref={cloudRef}>
            <sphereGeometry args={[2.02, 64, 64]} />
            <meshPhongMaterial 
                map={cloudMap}
                opacity={0.4}
                transparent={true}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

// Atmosphere component (no changes here)
const Atmosphere = ({ footprintScore }) => {
    const atmosphereColor = new THREE.Color().lerpColors(
        new THREE.Color('#58a6ff'),
        new THREE.Color('#a67c58'),
        Math.min(footprintScore / 15, 1)
    );
    return (
        <mesh scale={[1.1, 1.1, 1.1]}>
            <sphereGeometry args={[2, 64, 64]} />
            <shaderMaterial
                vertexShader={`
                    varying vec3 vertexNormal;
                    void main() {
                        vertexNormal = normalize(normalMatrix * normal);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `}
                fragmentShader={`
                    uniform vec3 glowColor;
                    varying vec3 vertexNormal;
                    void main() {
                        float intensity = pow(0.6 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                        gl_FragColor = vec4(glowColor, 1.0) * intensity;
                    }
                `}
                uniforms={{
                    glowColor: { value: atmosphereColor }
                }}
                blending={THREE.AdditiveBlending}
                side={THREE.BackSide}
                transparent={true}
            />
        </mesh>
    );
};


// === MAIN CHANGES ARE HERE ===
const Planet = ({ footprintScore }) => {
  return (
    // We adjust the camera position directly to frame the Earth
    // The Z-position is changed from 5 to 4, bringing the camera closer.
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }}> 
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      
      {/* We removed the <Bounds> component for direct control */}
      <Atmosphere footprintScore={footprintScore} />
      <Clouds />
      <Earth />
      
      <OrbitControls 
        enablePan={false}
        enableZoom={true} // Re-enable zoom if you want
        minDistance={3}   // Adjust as needed
        maxDistance={10}
        autoRotate={true}
        autoRotateSpeed={0.3}
      />
    </Canvas>
  );
};

export default Planet;