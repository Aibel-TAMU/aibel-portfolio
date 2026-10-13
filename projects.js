// projects.js
const projectsData = [
  {
    id: "tire-rig",
    category: "structural",
    title: "Vertical Tire Stiffness Test Rig",
    team: "Texas A&M SAE Baja // Suspension Subteam",
    timeline: "2026",
    tags: ["ANSYS Mechanical", "SolidWorks FEA", "Dynamic Load", "Pneumatic Actuation", "Analog Potentiometers"],
    summary: "High-load empirical test stand engineered to measure tire deflection rates and extract non-linear vertical spring curves ($K_{tire}$) across varied pressure regimes.",
    problemStatement: "Suspension kinematic models and damper valving curves previously relied on static vendor charts with up to 28% variance under aggressive high-G chassis roll.",
    executionHighlights: [
      "Transitioned structural chassis from hydraulic actuation to a regulated pneumatic ram, eliminating frame distortion and compliance artifacts.",
      "Iterated structural cage to circular tubular steel with triangulated gussets, cutting frame deflection error under 600 lbf normal load by 42%.",
      "Solved stress concentrations in ANSYS Mechanical to secure a 2.45 Factor of Safety at peak tire stall load.",
      "Calibrated high-speed analog linear distance sensors and S-beam load cells to log instantaneous force-displacement curves."
    ],
    engineeringSpecs: {
      "Actuation Method": "Pneumatic Cylinder (Regulated 0–120 PSI)",
      "FEA Solver": "ANSYS Mechanical 2026",
      "Rated Stall Capacity": "1,200 lbf (5,338 N)",
      "Factor of Safety (FoS)": "2.45 Peak Load",
      "Sensors Integrated": "Analog Linear Pot + Calibrated Load Cell"
    },
    images: [
      { src: "assets/project1/main.jpg", alt: "Mechanical Assembly Render (V4 Tubular Rig)" },
      { src: "assets/project1/slide1.jpg", alt: "Initial V1 Concept CAD Model" },
      { src: "assets/project1/slide2.png", alt: "V2 CAD Assembly & Load Paths" },
      { src: "assets/project1/slide3.png", alt: "Instrumentation & Data Acquisition Flow" },
      { src: "assets/project1/slide5.jpg", alt: "FEA Structural Deformation Heatmap" },
      { src: "assets/project1/slide8.png", alt: "Time-of-Flight (ToF) Sensor Calibration Analysis" },
      { src: "assets/project1/slide9.png", alt: "V4 Production CAD Model with Gusset Reinforcements" },
      { src: "assets/project1/slide10.png", alt: "V4 Final Validation Deflection Analysis" }
    ]
  },
  {
    id: "accelerated-daq",
    category: "daq",
    title: "Accelerated Powertrain DAQ Suite",
    team: "Texas A&M SAE Baja // Powertrain Subteam",
    timeline: "2026",
    tags: ["ESP32", "Altium PCB", "FreeRTOS", "BLE Protocol", "RaceBox Mini", "Hall Effect"],
    summary: "Real-time powertrain telemetry system deployed under compressed lead times to capture primary vs. secondary clutch engagement curves and vehicle acceleration.",
    problemStatement: "The CVT tuning team needed synchronized millisecond-accurate RPM data coupled to live 25 Hz GPS and inertial acceleration vectors to optimize flyweight profiles.",
    executionHighlights: [
      "Wrote dual-core FreeRTOS firmware dedicating Core 0 to hardware timer interrupts for ignition spark and secondary Hall-effect pickups.",
      "Implemented BLE packet sniffing algorithms to decode live 25 Hz heading, ground speed, and 3-axis G-forces from an onboard RaceBox Mini.",
      "Routed custom daughterboard schematics in Altium Designer with noise-filtering bypass networks.",
      "Designed and rapid-prototyped protective enclosures in SolidWorks using carbon-fiber reinforced PETG."
    ],
    engineeringSpecs: {
      "Microcontroller": "ESP32 Dual-Core Tensilica (240 MHz)",
      "Sampling Rate": "25 Hz GPS/IMU + 100 Hz RPM Pulse Timers",
      "Sensors": "Inductive Spark Pickup, Hall-Effect, RaceBox Mini",
      "Enclosure": "SolidWorks CAD, Bambu Lab CF-PETG",
      "Storage": "SPI High-Speed SD Datalogging with CRC"
    },
    images: [
      { src: "assets/project2/main.png", alt: "Accelerated DAQ Circuit Schematic & Pinout" },
      { src: "assets/project2/slide1.png", alt: "Custom Sensor Node Enclosure CAD" },
      { src: "assets/project2/slide2.png", alt: "Live Primary vs Secondary CVT RPM Telemetry Graph" },
      { src: "assets/project2/slide3.png", alt: "FreeRTOS Deterministic Capture Loop Firmware" },
      { src: "assets/project2/slide4.png", alt: "Full Hardware Interconnect Schematic" }
    ]
  },
  {
    id: "can-fd-daq",
    category: "daq",
    title: "Distributed CAN FD Vehicle Network",
    team: "Texas A&M SAE Baja // Controls & Telemetry",
    timeline: "2026–2027",
    tags: ["CAN FD Bus", "Altium PCB", "SolidWorks", "IP67 Enclosures", "Strain Gauges"],
    summary: "High-speed automotive CAN FD vehicle architecture featuring decentralized node enclosures and real-time suspension telemetry logging.",
    problemStatement: "Analog sensor runs over 8 feet in length picked up EMI noise from the Briggs ignition wire and added unwanted harness weight across the frame.",
    executionHighlights: [
      "Engineered distributed bus architecture utilizing CAN FD transceivers operating at 2 Mbps data phase rates.",
      "Modeled modular IP67 chassis junction node casings in SolidWorks featuring vibration isolators.",
      "Designed custom Altium Designer PCB modules with low-noise instrumentation amplifiers for quarter-bridge strain gauge sensors.",
      "Standardized vehicle harness connections with Mil-Spec crimped Deutsch DT sealed connectors."
    ],
    engineeringSpecs: {
      "Protocol": "CAN FD (2 Mbps data phase / 500 kbps arbitration)",
      "PCB Design": "Altium Designer (4-Layer impedance controlled)",
      "CAD Tool": "SolidWorks 2026 + Visualize 4K",
      "Connectors": "IP67 Deutsch DT Series",
      "Channels": "Steering Angle, Suspension Linear Pots, Strain Gauges"
    },
    images: [
      { src: "assets/project3/main.jpg", alt: "Central DAQ Hub Master Enclosure Render" },
      { src: "assets/project3/slide1.jpg", alt: "Distributed Node Casing Isometric Render" },
      { src: "assets/project3/slide2.jpg", alt: "Chassis Frame Mounting CAD Integration" },
      { src: "assets/project3/slide3.jpg", alt: "CAD Exploded Assembly View" },
      { src: "assets/project3/slide4.jpg", alt: "System Architecture & Bus Topology Overview" },
      { src: "assets/project3/slide5.jpg", alt: "Sensor Channel Allocation & Payload Matrix" },
      { src: "assets/project3/slide6.jpg", alt: "Sensor Selection Benchmarking Matrix" },
      { src: "assets/project3/slide7.jpg", alt: "Custom Strain Gauge Conditioning Circuit Schematic" }
    ]
  },
  {
    id: "autonomous-rc",
    category: "embedded",
    title: "Dual-Core Telemetry Ground Vehicle",
    team: "Independent Robotics Lab",
    timeline: "2026",
    tags: ["ESP32", "Embedded C", "UDP Sockets", "FreeRTOS", "SolidWorks"],
    summary: "Deterministic remote ground vehicle engineered for high-frequency low-latency teleoperation and continuous telemetry streaming.",
    problemStatement: "Standard commercial RC controllers exhibited non-deterministic packet delays and lacked synchronized IMU logging for trajectory reconstruction.",
    executionHighlights: [
      "Architected real-time firmware separating motor commutation and PWM capture on Core 0 from wireless UDP packets on Core 1.",
      "Re-engineered software from high-overhead MicroPython to compiled embedded C on FreeRTOS, dropping latency from 85 ms to sub-6 ms.",
      "Built safety watchdog routines executing instant motor shutdown upon telemetry packet timeout.",
      "Designed impact-resistant chassis mounting plates and battery cradles in SolidWorks."
    ],
    engineeringSpecs: {
      "Latency": "< 6 ms deterministic loop time",
      "Firmware": "Bare-Metal Embedded C / FreeRTOS",
      "Network Protocol": "Non-blocking UDP Sockets",
      "Safety": "Hardware Watchdog Timer (150 ms cutoff)"
    },
    images: [
      { src: "assets/project4/main.jpg", alt: "Dual-Core Telemetry Vehicle Assembly" },
      { src: "assets/project4/slide1.jpg", alt: "V2 Wireless Test Chassis & Controller Bench" }
    ]
  },
  {
    id: "naval-mounts",
    category: "structural",
    title: "Naval Propulsion Mounts & Differential Thrust",
    team: "Texas A&M Naval Design Team",
    timeline: "2025–2026",
    tags: ["OpenProp", "CFD", "Hydrodynamics", "SolidWorks", "Additive Carbon"],
    summary: "Hydrodynamically streamlined component brackets and differential thrust algorithms developed for autonomous surface marine craft.",
    problemStatement: "Mechanical rudder appendages created high drag at low displacement speeds and added mechanical failure points in turbulent surface wakes.",
    executionHighlights: [
      "Calculated hydrodynamic foil geometries in OpenProp and MATLAB to eliminate vortex cavitation.",
      "Modeled low-drag nacelle brackets in SolidWorks and validated flow separations with CFD simulations.",
      "Configured dual-motor differential yaw control algorithms for rudderless tight-radius heading authority.",
      "Fabricated waterproof motor assemblies in carbon-fiber reinforced polyamide (PA-CF)."
    ],
    engineeringSpecs: {
      "Hydrodynamics": "OpenProp Foil Hydrodynamics & MATLAB",
      "CAD Platform": "SolidWorks 3D Modeling",
      "Control Method": "Twin-ESC Differential Yaw Thrust Mixing",
      "Material": "Carbon-Fiber Reinforced Polyamide (PA-CF)"
    },
    images: [
      { src: "assets/project5/main.jpg", alt: "Hydrodynamic Propulsion Mount CAD Assembly" },
      { src: "assets/project5/slide1.jpg", alt: "Physical Hull Integration & Water-Sealing Bench" }
    ]
  }
];