window.projectsData = [
  {
    id: "tire-rig",
    category: "structural",
    title: "Vertical Tire Stiffness Test Stand",
    team: "Texas A&M SAE Baja // Suspension Subteam",
    timeline: "2026",
    statusBadge: "VALIDATED // FoS 2.45",
    tags: ["ANSYS Mechanical", "SolidWorks Simulation", "Pneumatic Ram", "Structural FEA", "Analog Calibration"],
    summary: "High-load empirical test stand engineered to measure dynamic tire deflection and extract non-linear vertical spring rates (Ktire) across discrete pressure regimes.",
    problemStatement: "Vendor lookup tables exhibited up to 28% spring rate variance under dynamic loading, degrading suspension damper valving.",
    executionHighlights: [
      "Transitioned structural chassis from hydraulic actuation to a regulated pneumatic ram, eliminating frame distortion and compliance artifacts.",
      "Iterated structural cage to circular tubular steel with triangulated gusset plates, reducing vertical deflection error under 600 lbf normal load by 42%.",
      "Resolved peak stress concentrations in ANSYS Mechanical, verifying a 2.45 Factor of Safety at stall load.",
      "Calibrated high-speed analog linear distance sensors and S-beam load cells to log instantaneous force-displacement curves."
    ],
    engineeringSpecs: {
      "Actuation Method": "Pneumatic Cylinder (Regulated 0–120 PSI)",
      "FEA Solver Platform": "ANSYS Mechanical & SolidWorks Simulation",
      "Stall Load Capacity": "1,200 lbf (5,338 N)",
      "Safety Factor (FoS)": "2.45 at Peak Stall Load",
      "Instrumentation": "S-Type Load Cell + Precision Analog Linear Pot"
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
    id: "can-fd-daq",
    category: "daq",
    title: "Distributed CAN FD Vehicle Network",
    team: "Texas A&M SAE Baja // Controls & Telemetry",
    timeline: "2026–2027",
    statusBadge: "IP67 COMPLIANT // 2 Mbps",
    tags: ["CAN FD Bus", "Altium Designer", "SolidWorks Visualize", "IP67 Enclosures", "Strain Gauges"],
    summary: "Decentralized automotive CAN FD vehicle architecture featuring modular node enclosures, custom conditioning PCBs, and high-rate telemetry acquisition.",
    problemStatement: "Legacy point-to-point analog wiring bundles suffered from electromagnetic interference off the Briggs ignition coil and added over 8 lbs of excess vehicle mass.",
    executionHighlights: [
      "Architected distributed bus topology utilizing CAN FD transceivers operating at 2 Mbps data phase rates over shielded twisted pairs.",
      "Modeled modular IP67 chassis junction node casings in SolidWorks featuring integrated vibration isolators.",
      "Designed custom Altium Designer PCB daughterboards with low-noise instrumentation amplifiers for quarter-bridge strain gauge sensors.",
      "Standardized vehicle harness connections with Mil-Spec crimped Deutsch DT sealed connectors."
    ],
    engineeringSpecs: {
      "Bus Protocol": "CAN FD (2 Mbps data phase / 500 kbps arbitration)",
      "PCB Design Tool": "Altium Designer (4-Layer impedance controlled)",
      "CAD Platform": "SolidWorks 2026 + SolidWorks Visualize 4K",
      "Connector Standard": "IP67 Deutsch DT Series",
      "Telemetry Channels": "Steering Angle, Linear Suspension Travel, Strain Gauges"
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
    id: "accelerated-daq",
    category: "daq",
    title: "Accelerated Powertrain DAQ Suite",
    team: "Texas A&M SAE Baja // Powertrain Subteam",
    timeline: "2026",
    statusBadge: "TRACK DEPLOYED // 100 Hz",
    tags: ["ESP32 Dual-Core", "Altium PCB", "FreeRTOS", "BLE Protocol", "RaceBox Mini", "Hall Effect"],
    summary: "Real-time powertrain telemetry system deployed under compressed lead times to capture primary vs. secondary clutch engagement curves and vehicle acceleration.",
    problemStatement: "The CVT tuning subteam required synchronized millisecond-accurate RPM data coupled to live 25 Hz GPS and inertial acceleration vectors to optimize flyweight shift profiles.",
    executionHighlights: [
      "Wrote deterministic FreeRTOS firmware dedicating Core 0 to hardware timer interrupts for ignition spark and secondary Hall-effect pickups.",
      "Implemented a BLE packet sniffing engine to decode live 25 Hz heading, ground speed, and 3-axis G-forces from an onboard RaceBox Mini.",
      "Routed custom daughterboard schematics in Altium Designer with noise-filtering bypass networks.",
      "Designed and 3D-printed rugged IP-rated protective node enclosures in carbon-fiber reinforced PETG in SolidWorks."
    ],
    engineeringSpecs: {
      "Microcontroller": "ESP32 Tensilica Dual-Core (240 MHz)",
      "Sampling Frequencies": "25 Hz GNSS/IMU + 100 Hz Hardware RPM Timers",
      "Sensors Synchronized": "Inductive Spark Pickup, Hall-Effect, RaceBox Mini",
      "Enclosure Material": "SolidWorks CAD, Bambu Lab CF-PETG",
      "Storage Architecture": "SPI High-Speed SD Datalogging with Hardware CRC"
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
    id: "autonomous-rc",
    category: "embedded",
    title: "Dual-Core Telemetry Ground Vehicle",
    team: "Independent Robotics Lab",
    timeline: "2026",
    statusBadge: "DETERMINISTIC // SUB-6ms",
    tags: ["ESP32", "Embedded C", "UDP Sockets", "FreeRTOS", "SolidWorks CAD"],
    summary: "Deterministic remote ground vehicle engineered for high-frequency low-latency teleoperation and continuous wireless telemetry streaming.",
    problemStatement: "Standard commercial RC controllers exhibited non-deterministic packet delays and lacked synchronized IMU logging for trajectory reconstruction.",
    executionHighlights: [
      "Separated real-time tasks: Core 0 handles motor commutation and hardware PWM timers, while Core 1 processes wireless UDP communication.",
      "Transitioned software from interpreted MicroPython to compiled embedded C on FreeRTOS, dropping latency from 85 ms to sub-6 ms.",
      "Constructed safety watchdog routines executing instant motor shutdown upon telemetry packet timeout.",
      "Designed impact-resistant chassis mounting plates and battery cradles in SolidWorks."
    ],
    engineeringSpecs: {
      "Deterministic Latency": "< 6 ms loop execution time",
      "Firmware Base": "Bare-Metal Embedded C / FreeRTOS Multi-Tasking",
      "Network Protocol": "Non-blocking UDP Wireless Sockets",
      "Failsafe Mechanism": "Hardware Watchdog Timer (150 ms cutoff)"
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
    statusBadge: "CFD VALIDATED // PA-CF",
    tags: ["OpenProp", "CFD", "Hydrodynamics", "SolidWorks", "Additive Manufacturing"],
    summary: "Hydrodynamically streamlined component brackets and differential thrust algorithms developed for autonomous surface marine craft.",
    problemStatement: "Mechanical rudder appendages created high drag at low displacement speeds and added mechanical failure points in turbulent surface wakes.",
    executionHighlights: [
      "Calculated hydrodynamic foil geometries in OpenProp and MATLAB to eliminate vortex cavitation.",
      "Modeled low-drag nacelle brackets in SolidWorks and validated flow separations with CFD simulations.",
      "Configured dual-motor differential yaw control algorithms for rudderless tight-radius heading authority.",
      "Fabricated waterproof motor assemblies in carbon-fiber reinforced polyamide (PA-CF)."
    ],
    engineeringSpecs: {
      "Hydrodynamic Tools": "OpenProp Foil Hydrodynamics & MATLAB",
      "CAD Platform": "SolidWorks 3D Modeling",
      "Control Logic": "Twin-ESC Differential Yaw Thrust Mixing Matrix",
      "Material": "Carbon-Fiber Reinforced Polyamide (PA-CF)"
    },
    images: [
      { src: "assets/project5/main.jpg", alt: "Hydrodynamic Propulsion Mount CAD Assembly" },
      { src: "assets/project5/slide1.jpg", alt: "Physical Hull Integration & Water-Sealing Bench" }
    ]
  }
];