const projectsData = [
  {
    title: "Tire Stiffness Rig",
    showcase: true,
    tags: ["Structural Analysis", "Mechanical Design", "FEA", "Testing/Validation"],
    description: "End to End development of platform intended to give suspension team validated data on tire stiffness values under different psi ranges. Went through multi-iterative design, from initial concept CAD and rendering, where actuation was done through hydraulic jack set up and sensor driven data procurement. After error analysis and cost concerns, design was changed to utilize a pneumatic actuation method and much tighter clearances to save on material cost and decrease deflection error due to bending. V4 is currently slated to be ready for production in mid september, with a circular tubing design and gussets, with data procurement done primarily through analog means. CAD was done is SolidWorks, and FEA was done in SolidWorks and Ansys.",
    images: [
      { src: "assets/project1/main.jpg", alt: "Mechanical Assembly Render (1)" },
      { src: "assets/project1/slide1.jpg", alt: "V1 CAD model" },
      { src: "assets/project1/slide2.png", alt: "Mechanical Assembly Render" },
      { src: "assets/project1/slide3.png", alt: "Data Flow Diagram" },
      { src: "assets/project1/slide5.jpg", alt: "FEA (deformation)" },
      { src: "assets/project1/slide8.png", alt: "ToF Calibration Analysis" },
      { src: "assets/project1/slide9.png", alt: "V4 CAD model" },
      { src: "assets/project1/slide10.png", alt: "V4 deformotion FEA" }
    ]
  },
  {
    title: "Accelerated 26' DAQ",
    showcase: true,
    tags: ["BLE Protocol", "ESP32", "Altium PCB", "Embedded Systems", "Mechanical Integration"],
    description: "Architected a modular DAQ system under a strict timeline to provide CVT team with data to validate their acceleration model. DAQ utilizes an inductive sensor and a hall effect sensor to capture primary and secondary rpm, and a racebox mini to collect gps, velocity, and acceleration data. ESP32 acts as the central logger, utilizing its adc and supporting circuitry to communicate with the inductive sensor and uses BLE to sniff outgoing data packets from the racebox. Custom Casing was designed in SolidWorks",
    images: [
      { src: "assets/project2/main.png", alt: "Accelerated DAQ Schematic" },
      { src: "assets/project2/slide1.png", alt: "Node Casing CAD" },
      { src: "assets/project2/slide2.png", alt: "Example Data from Initial Testing"},
      { src: "assets/project2/slide3.png", alt: "Main loop code"},
      { src: "assets/project2/slide4.png", alt: "DAQ Schematic"}

    ]
  },
  {
    title: "26'/27' DAQ Design",
    showcase: true,
    tags: ["CAN FD", "Mechanical Integration", "CAD Design, PCB"],
    description: "Developed an autonomous, solar-powered environmental sensing platform utilizing an ESP32. Implemented deep-sleep optimization routines for multi-month battery life, transmitting processed sensor telemetry via MQTT to a custom cloud dashboard for remote monitoring.",
    images: [
      { src: "assets/project3/main.jpg", alt: "Node Casing Render (1)" },
      { src: "assets/project3/slide1.jpg", alt: "Node Casing Render (2)" },
      { src: "assets/project3/slide2.jpg", alt: "CAD" },
      { src: "assets/project3/slide3.jpg", alt: "CAD Exploded View" },
      { src: "assets/project3/slide4.jpg", alt: "System Overview" },
      { src: "assets/project3/slide5.jpg", alt: "Data List" },
      { src: "assets/project3/slide6.jpg", alt: "Sensor Selection V1" },
      { src: "assets/project3/slide7.jpg", alt: "Strain Gauge PCB Diagram" },
    ]
  },
  {
    title: "Dual-Core Autonomous Vehicle",
    showcase: false,
    tags: ["ESP32", "Embedded C", "UDP Protocol", "SolidWorks"],
    description: "Built a custom remote-operated vehicle platform prioritizing real-time deterministic motor control on Core 0 and low-latency wireless UDP communication processing on Core 1. V1 utilized a 10ft long USB cord with software written in MicroPython. V2 went fully wireless using UDP network protocols and software written in C",
    images: [
      { src: "assets/project4/main.jpg", alt: "" },
      { src: "assets/project4/slide1.jpg", alt: "" }
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
