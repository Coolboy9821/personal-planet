import React, { useRef, useEffect } from 'react';
import './ConstellationCanvas.css';

const ConstellationCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // --- Configuration ---
    const NUM_STARS = 150;
    const STAR_COLOR = 'rgba(255, 255, 255, 0.7)';
    const LINE_COLOR = 'rgba(255, 255, 255, 0.1)';
    const LINE_DISTANCE = 120;
    // --------------------

    let stars = [];

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      stars = [];
      for (let i = 0; i < NUM_STARS; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      ctx.fillStyle = STAR_COLOR;
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connecting lines
      ctx.strokeStyle = LINE_COLOR;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dist = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y);
          
          if (dist < LINE_DISTANCE) {
            const opacity = 1 - (dist / LINE_DISTANCE);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const update = () => {
      stars.forEach(star => {
        star.x += star.vx;
        star.y += star.vy;

        // Wrap around screen edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
      });
    };

    const animate = () => {
      update();
      draw();
      animationFrameId = requestAnimationFrame(animate);
    };
    
    const handleResize = () => {
        setCanvasSize();
        createStars();
    }

    // Initial setup
    setCanvasSize();
    createStars();
    animate();

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="constellation-canvas" />;
};

export default ConstellationCanvas;