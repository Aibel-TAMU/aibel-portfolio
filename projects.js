const projectsData = [
  {
    title: "Tire Stiffness Rig",
    showcase: true,
    tags: ["Embedded C", "Mechanical Design", "FEA", "Testing/Validation"],
    description: "Designed a test rig to gather vertical tire stiffness data to provide crucial data to the suspension team to improve their quarter car model and generate pressure-to-stiffness look up tables. Full end-to-end development from conceptual design and CAD + FEA, to embedded systems design and manufacturing. Also performed error analysis on the ToF sensor that will be used for the rig",
    images: [
      { src: "assets/project1/main.jpg", alt: "Mechanical Assembly Render (1)" },
      { src: "assets/project1/slide1.jpg", alt: "Mechanical Assembly Render (2)" },
      { src: "assets/project1/slide2.png", alt: "SolidWorks Assembly" },
      { src: "assets/project1/slide3.png", alt: "Data Flow Diagram" },
      { src: "assets/project1/slide4.jpg", alt: "FEA (stress)" },
      { src: "assets/project1/slide5.jpg", alt: "FEA (deformation)" },
      { src: "assets/project1/slide6.jpg", alt: "FEA (strain)" },
      { src: "assets/project1/slide7.png", alt: "ToF Noise Analysis" },
      { src: "assets/project1/slide8.png", alt: "ToF Calibration Analysis" }
    ]
  },
  {
    title: "Distributed DAQ",
    showcase: true,
    tags: ["CAN FD", "STM32", "Altium PCB", "Data Analysis", "Embedded Systems"],
    description: "Engineered a high-speed, distributed data acquisition network optimized for multi-node data logging. Designed custom STM32 corner nodes supporting robust CAN FD communication protocols, utilizing multi sensor suite for dynamic system validation. Full system design prioritized reliability and performance under harsh Baja conditions",
    images: [
      { src: "assets/project2/main.png", alt: "Full System DAQ Diagram" },
      { src: "assets/project2/slide1.jpg", alt: "Front Node Casing Render (1)" },
      { src: "assets/project2/slide2.jpg", alt: "Front Node Casing Render (2)" },
      //{ src: "assets/project2/slide3.jpg", alt: "Front Node Casing Design" }
    ]
  },
  {
    title: "Environmental Monitoring Edge Node",
    showcase: false,
    tags: ["IoT / ESP32", "Low Power", "Cloud Integration", "CAD Design"],
    description: "Developed an autonomous, solar-powered environmental sensing platform utilizing an ESP32. Implemented deep-sleep optimization routines for multi-month battery life, transmitting processed sensor telemetry via MQTT to a custom cloud dashboard for remote monitoring.",
    images: [
      { src: "assets/project3/main.jpg", alt: "System Architecture Diagram" },
      { src: "assets/project3/slide1.jpg", alt: "3D Printed Enclosure CAD (SolidWorks)" },
      { src: "assets/project3/slide2.jpg", alt: "Live Cloud Dashboard Screenshot" }
    ]
  },
  {
    title: "Dual-Core Autonomous Vehicle",
    showcase: true,
    tags: ["ESP32", "Embedded C", "UDP Protocol", "SolidWorks"],
    description: "Built a custom remote-operated vehicle platform prioritizing real-time deterministic motor control on Core 0 and low-latency wireless UDP communication processing on Core 1.",
    images: [
      { src: "assets/project4/main.jpg", alt: "Vehicle Chassis Overview" },
      { src: "assets/project4/slide1.jpg", alt: "Assembly View" }
    ]
  },
  {
    title: "Naval Propulsion Mounts & Differential Thrust",
    showcase: false,
    tags: ["3D Printing", "Naval Design", "SolidWorks", "Electrical Subsystems"],
    description: "Engineered custom 3D-printed component mounts and implemented differential thrust control algorithms for the university Naval Design team.",
    images: [
      { src: "assets/project5/main.jpg", alt: "Propulsion Mount CAD" },
      { src: "assets/project5/slide1.jpg", alt: "Physical Build" }
    ]
  }
];
