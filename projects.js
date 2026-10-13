const projectsData = [
  {
    id: "tire-rig",
    category: "structural",
    title: "Vertical Tire Stiffness Test Rig",
    team: "Texas A&M SAE Baja // Suspension Subteam",
    timeline: "2026",
    tags: ["ANSYS Mechanical", "SolidWorks", "Structural FEA", "Analog DAQ", "Pneumatic Actuation"],
    summary: "End-to-end development of an empirical tire stiffness calibration platform delivering validated spring-rate curves across discrete operating PSI ranges.",
    problemStatement: "The vehicle suspension team required real spring constants (K_tire) to optimize shock damping curves, but existing vendor lookup tables showed up to 28% variance under high dynamic chassis loading.",
    executionHighlights: [
      "V1–V3 prototypes transitioned from a hydraulic bottle-jack architecture to a precision pneumatic cylinder configuration, eliminating frame deflection artifacts.",
      "Iterated structural chassis CAD to tubular circular steel with triangulated gusset plates, reducing vertical deflection error under 600 lbf normal load by 42%.",
      "Conducted structural finite element stress and deflection simulations across SolidWorks Simulation and ANSYS Mechanical, guaranteeing a minimum factor of safety (FoS) > 2.4.",
      "Integrated dual analog displacement potentiometers and calibrated load cell readouts with zero-latency baseline logging."
    ],
    engineeringSpecs: {
      "Actuation Method": "Pneumatic Cylinder (Regulated 0–120 PSI)",
      "FEA Platform": "ANSYS Mechanical & SolidWorks Simulation",
      "Target Load Capacity": "1,200 lbf (5,338 N)",
      "Safety Factor (FoS)": "2.45 at peak dynamic stall load",
      "Instrumentation": "Calibrated S-type load cell + analog linear pot"
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
    title: "Accelerated Powertrain DAQ Platform",
    team: "Texas A&M SAE Baja // Powertrain & CVT",
    timeline: "2026",
    tags: ["ESP32", "Altium Designer", "BLE Protocol", "FreeRTOS", "RaceBox Mini", "Sensor Integration"],
    summary: "High-speed modular telemetry and datalogging suite engineered under compressed timelines to validate continuously variable transmission (CVT) shift curves.",
    problemStatement: "The drivetrain subteam needed synchronized millisecond-accurate primary vs. secondary CVT RPM together with ground speed and acceleration vectors to tune flyweight engagement.",
    executionHighlights: [
      "Engineered dual-channel pulse-counter firmware running deterministic FreeRTOS hardware timer interrupts on ESP32 Core 0.",
      "Interfaced an inductive pickup sensor on primary ignition and an automotive Hall-effect sensor on secondary clutch shaft.",
      "Implemented a Bluetooth Low Energy (BLE) packet sniffing engine to capture 25Hz GPS, heading, velocity, and 3-axis G-forces from an onboard RaceBox Mini.",
      "Designed and 3D-printed rugged IP-rated protective node enclosures in carbon-fiber reinforced filament in SolidWorks."
    ],
    engineeringSpecs: {
      "Primary Controller": "ESP32 Tensilica Dual-Core (240 MHz)",
      "Sensors Synchronized": "Inductive spark, Hall-effect gear tooth, RaceBox Mini",
      "Telemetry Rate": "25 Hz GNSS/IMU + 100 Hz RPM capture",
      "Firmware Base": "FreeRTOS / ESP-IDF with SPI SD datalogging",
      "Enclosure": "SolidWorks CAD, Bambu Lab CF-PETG custom casing"
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
    title: "Next-Gen 26'/27' CAN FD Vehicle Network",
    team: "Texas A&M SAE Baja // Controls & Telemetry",
    timeline: "2026–2027",
    tags: ["CAN FD Bus", "Altium PCB", "SolidWorks", "Telemetry Logging", "IP67 Enclosures"],
    summary: "Distributed vehicle-wide sensor network with CAN Flexible Data-Rate (CAN FD) transceivers, custom nodal PCBs, and telemetry acquisition.",
    problemStatement: "Legacy point-to-point analog wiring bundles suffered from EM noise pickup off the Briggs & Stratton ignition coil and added over 8 lbs of excess vehicle mass.",
    executionHighlights: [
      "Designed decentralized nodal architecture utilizing high-speed CAN FD bus transceivers with twisted-shielded differential pairs.",
      "Modeled custom IP67 splash-resistant chassis junction enclosures in SolidWorks with integrated vibration isolators.",
      "Developed custom Altium Designer PCB daughterboards for low-noise strain gauge instrumentation and analog suspension travel sensors.",
      "Implemented cyclic redundancy checking (CRC) and priority-based message arbitrations for steering angle, wheel speeds, and brake line pressures."
    ],
    engineeringSpecs: {
      "Protocol": "CAN FD (2 Mbps data phase / 500 kbps arbitration)",
      "CAD Platform": "SolidWorks 2026 + SolidWorks Visualize",
      "PCB Layout": "Altium Designer (4-Layer impedance matched)",
      "Environmental": "IP67 sealed Deutsch DT connector terminations",
      "Target Channels": "Suspension potentiometers, strain gauges, brake pressure"
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
    title: "Dual-Core Deterministic Telemetry Platform",
    team: "Independent Robotics Lab",
    timeline: "2026",
    tags: ["ESP32", "Embedded C", "UDP Protocol", "FreeRTOS", "SolidWorks"],
    summary: "Custom remote-operated vehicle platform engineered around hard-real-time dual-core microcontroller scheduling and wireless socket telemetry.",
    problemStatement: "Standard consumer wireless RC architectures introduce latency spikes and packet dropouts when simultaneously streaming IMU data and PWM drive actuation.",
    executionHighlights: [
      "Separated real-time deterministic tasks: Core 0 handles motor commutation, hardware PWM timers, and fail-safe watchdog timeouts.",
      "Allocated Core 1 exclusively for high-throughput wireless UDP communication and telemetry packet serialization.",
      "Progressed from V1 tethered MicroPython prototype to V2 compiled C on FreeRTOS, dropping actuation latency from 85 ms to sub-6 ms.",
      "Modeled and 3D-printed modular chassis components and vibration-damped battery cradles."
    ],
    engineeringSpecs: {
      "Latency": "< 6 ms deterministic response over WiFi UDP",
      "Software Stack": "Bare-Metal C / FreeRTOS Multi-Tasking",
      "Safety": "Hardware watchdog timer + auto-kill on heartbeat timeout",
      "Chassis": "Custom 3D-printed PETG high-impact structural modular tub"
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
    tags: ["Hydrodynamics", "Differential Thrust", "SolidWorks", "OpenProp", "CFD"],
    summary: "Hydrodynamically streamlined propulsion brackets and closed-loop differential yaw thrust mixing algorithms for competition autonomous surface craft.",
    problemStatement: "Traditional mechanical rudder assemblies added parasitic hydrodynamic drag and mechanical complexity in turbulent water entry profiles.",
    executionHighlights: [
      "Modeled hydrodynamic nacelle component brackets in SolidWorks and validated water-flow wake vortex shedding.",
      "Calculated required torque and motor thrust profiles using OpenProp hydrofoil simulations and MATLAB calculation scripts.",
      "Implemented twin-esc differential thrust mixing equations for tight-radius low-speed harbor maneuverability without mechanical rudders.",
      "Fabricated waterproof, marine-grade additive assemblies utilizing carbon-fiber reinforced nylon."
    ],
    engineeringSpecs: {
      "Tooling": "SolidWorks CAD, OpenProp, MATLAB, 3D additive manufacturing",
      "Control Method": "Differential yaw thrust mapping matrix",
      "Material": "Carbon-Fiber Reinforced Polyamide (PA-CF)",
      "Hydrodynamics": "Streamlined nacelle with reduced drag coefficient"
    },
    images: [
      { src: "assets/project5/main.jpg", alt: "Hydrodynamic Propulsion Mount CAD Assembly" },
      { src: "assets/project5/slide1.jpg", alt: "Physical Hull Integration & Water-Sealing Bench" }
    ]
  }
];