const canNodesData = [
  {
    id: "master-daq",
    title: "NODE 01 // Master DAQ Logger",
    controller: "ESP32 Tensilica Dual-Core (240 MHz)",
    transceiver: "MCP2518FD + ATA6561 (CAN FD 2.0)",
    busSpeed: "2 Mbps Data Phase / 500 kbps Arbitration",
    sampleRate: "100 Hz Logging to High-Speed SPI SD Card",
    hardwareSpecs: [
      "Hardware DMA SPI bus for high-bandwidth telemetry write cycles",
      "Dedicated FreeRTOS core 0 interrupt timer for ignition pulse counting",
      "Integrated BLE packet sniffer for RaceBox Mini 25Hz GPS / IMU ingestion",
      "Custom 3D-printed carbon-fiber PETG enclosure with IP65 rubber gasket seals"
    ],
    payloadChannels: [
      { id: "0x100", name: "ENGINE_CVT_RPM", rate: "100 Hz", payload: "Primary RPM [uint16], Secondary RPM [uint16]" },
      { id: "0x102", name: "CHASSIS_DYNAMICS", rate: "25 Hz", payload: "Lat_G [int16], Long_G [int16], Yaw_Rate [int16]" },
      { id: "0x104", name: "GPS_TELEMETRY", rate: "25 Hz", payload: "Ground_Speed [uint16], Heading [uint16], Sat_Count [uint8]" }
    ]
  },
  {
    id: "suspension-node",
    title: "NODE 02 // Front Suspension & Steering",
    controller: "RP2040 Dual ARM Cortex-M0+",
    transceiver: "TCAN337 CAN FD Transceiver",
    busSpeed: "2 Mbps Data Phase",
    sampleRate: "100 Hz Continuous ADC DMA",
    hardwareSpecs: [
      "Linear travel potentiometers installed on front double A-arms",
      "Cherry Hall-effect non-contact steering column rotary sensor",
      "Low-pass RC analog filter stage to mitigate coil EMF vibration noise",
      "Direct chassis tab mounting with silicone isolator bushings"
    ],
    payloadChannels: [
      { id: "0x200", name: "SUSPENSION_TRAVEL_FL_FR", rate: "100 Hz", payload: "Travel_FL [uint16], Travel_FR [uint16]" },
      { id: "0x202", name: "STEERING_ANGLE", rate: "100 Hz", payload: "Steer_Angle [int16], Angular_Velocity [int16]" }
    ]
  },
  {
    id: "strain-node",
    title: "NODE 03 // Suspension Arm Strain Gauge Hub",
    controller: "STM32F401 BlackPill",
    transceiver: "MCP2562FD High-Speed CAN FD",
    busSpeed: "2 Mbps Data Phase",
    sampleRate: "50 Hz Calibrated Strain Capture",
    hardwareSpecs: [
      "Custom Altium 4-layer daughterboard with precision Wheatstone bridges",
      "INA128 low-drift instrumentation amplifiers with calibrated gain trimmer",
      "Differential twisted shielded harness pair to suppress ignition harmonics",
      "Thermal compensation bridge network for ambient 40°C–110°F operating conditions"
    ],
    payloadChannels: [
      { id: "0x300", name: "WISHBONE_STRESS_LOWER", rate: "50 Hz", payload: "Strain_A_Arm_L [int16], Strain_A_Arm_R [int16]" },
      { id: "0x302", name: "TIE_ROD_TENSION", rate: "50 Hz", payload: "Tie_Rod_Force_L [int16], Tie_Rod_Force_R [int16]" }
    ]
  },
  {
    id: "rear-powertrain",
    title: "NODE 04 // Rear Powertrain & Brake Pressure",
    controller: "ESP32-S3 Mini",
    transceiver: "TCAN1044A CAN FD Transceiver",
    busSpeed: "2 Mbps Data Phase",
    sampleRate: "100 Hz Analog Pressure Capture",
    hardwareSpecs: [
      "Hydraulic brake line pressure transducer (0–2000 PSI)",
      "High-temperature infrared tire and CVT belt surface temperature sensors",
      "Deutsch DT series sealed motorsport connectors",
      "Independent 3.3V low-dropout voltage regulation to decouple alternator spikes"
    ],
    payloadChannels: [
      { id: "0x400", name: "BRAKE_PRESSURE_CVT_TEMP", rate: "100 Hz", payload: "Brake_Line_PSI [uint16], Belt_Surface_Temp [uint16]" },
      { id: "0x402", name: "REAR_SHOCK_DISPLACEMENT", rate: "100 Hz", payload: "Travel_RL [uint16], Travel_RR [uint16]" }
    ]
  }
];

const projectsData = [
  {
    id: "tire-rig",
    category: "structural",
    title: "Vertical Tire Stiffness Test Stand",
    team: "Texas A&M SAE Baja // Suspension Subteam",
    timeline: "2026",
    tags: ["ANSYS Mechanical", "SolidWorks Simulation", "Pneumatic Ram", "Structural FEA", "Analog Calibration"],
    summary: "High-load empirical test stand engineered to measure tire deflection rates and extract non-linear vertical spring curves ($K_{tire}$) across discrete inflation regimes.",
    problemStatement: "The vehicle suspension team required real spring constants ($K_{tire}$) to optimize damper valving, but vendor lookup tables exhibited up to 28% variance under high dynamic chassis loading.",
    executionHighlights: [
      "Transitioned structural chassis from hydraulic actuation to a regulated pneumatic ram, eliminating frame distortion and compliance artifacts.",
      "Iterated structural cage to circular tubular steel with triangulated gusset plates, reducing vertical deflection error under 600 lbf normal load by 42%.",
      "Solved stress concentrations in ANSYS Mechanical, verifying a 2.45 Factor of Safety at peak tire stall load.",
      "Calibrated high-speed analog linear distance sensors and S-beam load cells to log instantaneous force-displacement curves."
    ],
    engineeringSpecs: {
      "Actuation Method": "Pneumatic Cylinder (Regulated 0–120 PSI)",
      "FEA Solver Platform": "ANSYS Mechanical & SolidWorks Simulation",
      "Stall Load Capacity": "1,200 lbf (5,338 N)",
      "Safety Factor (FoS)": "2.45 at Peak Load",
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
    id: "accelerated-daq",
    category: "daq",
    title: "Accelerated Powertrain DAQ Suite",
    team: "Texas A&M SAE Baja // Powertrain Subteam",
    timeline: "2026",
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
    id: "can-fd-daq",
    category: "daq",
    title: "Distributed CAN FD Vehicle Network",
    team: "Texas A&M SAE Baja // Controls & Telemetry",
    timeline: "2026–2027",
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
    id: "autonomous-rc",
    category: "embedded",
    title: "Dual-Core Telemetry Ground Vehicle",
    team: "Independent Robotics Lab",
    timeline: "2026",
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