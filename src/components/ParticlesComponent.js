import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo } from "react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesComponent = (props) => {

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
      // You can remove the commented line if you want to use loadBasic instead
      // await loadBasic(engine);
    });
    
  }, []);

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "#000000", // Dark background to make the particles stand out
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 4, // Number of particles added on click
          },
          repulse: {
            distance: 100,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: ["#ff0099", "#ffcc00", "#66ff66"], // Array of colors for particles
        },
        links: {
          color: "#ffffff",
          distance: 100,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: true,
          speed: 2,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            value_area: 800,
          },
          value: 100,
        },
        opacity: {
          value: { min: 0.3, max: 0.7 }, // Varying opacity for a magical effect
        },
        shape: {
          type: ["circle", "square", "triangle"], // Multiple shapes for variety
        },
        size: {
          value: { min: 1, max: 5 }, // Larger particles for a more magical effect
        },
      },
      detectRetina: true, // Enable retina detection for high-DPI screens
    }),
    [],
  );

  return <Particles id={props.id} options={options} />;
};

export default ParticlesComponent;
