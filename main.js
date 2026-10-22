/**
 * ============================================================================
 * AIBEL JOMON // ENGINEERING PORTFOLIO DATA ENGINE (main.js)
 * ============================================================================
 * HOW TO ADD A NEW PROJECT OR EDIT CONTENT:
 * 1. Scroll down to `PORTFOLIO_DATA.projects`.
 * 2. Copy any existing project block `{ ... }` and paste it at the top of the array.
 * 3. Drop your images into your `/assets/` folder and update the `url` path in `media`.
 *    (If an image path doesn't exist yet, the engine automatically renders a custom
 *    high-contrast CAD/Telemetry vector schematic placeholder so the UI never breaks.)
 * 4. Any new `category` string you type will automatically generate a new filter button.
 * ============================================================================
 */

const PORTFOLIO_DATA = {
  profile: {
    name: "AIBEL JOMON",
    handle: "AIBEL.ENGINEER",
    tagline: "WHERE SILICON MEETS STEEL.",
    headline: "Mechanical Systems, Test Engineering & Embedded Systems.",
    subheadline:
      "Undergraduate Mechanical & Electrical Engineer at Texas A&M University (4.0 GPA). Designing, simulating, and validating high-reliability data acquisition architectures, test rigs, and custom electromechanical hardware.",
    location: "COLLEGE STATION, TX // 30.6280° N, 96.3344° W",
    status: "AVAILABLE FOR SUMMER 2027 ROLES // TEST, CONTROLS, DYNAMICS & HARDWARE INTEGRATION",
    email: "ajomon@tamu.edu", // Update with your preferred contact email
    resumeUrl: "./assets/Aibel_Jomon_Resume.pdf",
    socials: {
      github: "https://github.com/Aibel-TAMU",     // Add your exact GitHub username
      linkedin: "http://www.linkedin.com/in/aibel"  // Add your exact LinkedIn handle
    },
    heroSpecs: [
      {
        code: "SYS.ACAD",
        label: "TEXAS A&M UNIVERSITY",
        value: "B.S. MECH ENG + EE MINOR",
        sub: "4.00 / 4.00 Cumulative GPA // May 2029"
      },
      {
        code: "SYS.BAJA",
        label: "TAMU SAE BAJA",
        value: "LEAD TEST ENGINEER",
        sub: "DAQ // Test Rigs // CAN Architecture // Dyno Development"
      },
      {
        code: "SYS.NAVAL",
        label: "NAVAL DESIGN TEAM (PEP)",
        value: "Electronics & Analysis Engineer",
        sub: "Diff-Thrust Firmware // Ansys Fluent Simulations // Electronic Component Integration"
      },
      {
        code: "SYS.CORE",
        label: "PRIMARY DISCIPLINES",
        value: "DAQ // FEA // EMBEDDED // CAD",
        sub: "ANSYS • SolidWorks • Fusion360 • Altium • C/C++ • Python • Rust"
      }
    ]
  },

  /**
   * ==========================================================================
   * PROJECTS ARRAY — ADD, REORDER, OR EDIT PROJECTS HERE
   * ==========================================================================
   */
  projects: [
    {
      id: "SYS-01",
      title: "6-Axis Wheel Force Transducer (WFT) Integration & Testing Analysis",
      category: "Test & DAQ",
      featured: true,
      status: "VALIDATED",
      date: "OCT 2026",
      subtitle: "Michigan Scientific WFT integration, DAQ Casing Design, and Python post-processing pipeline for multi-axis suspension load extraction.",
      heroMetrics: [
        { label: "CHANNELS", value: "6-Axis Load + Moment" },
        { label: "BUS PROTOCOL", value: "High-Speed CAN" },
        { label: "PIPELINE", value: "Python" }
      ],
      techStack: ["CAN Bus", "Michigan Scientific WFT", "Python", "Custom DAQ", "pandas", "SolidWorks"],
      summary:
        "Integrated a 6-axis Wheel Force Transducer onto the Texas A&M SAE Baja vehicle to capture real-time forces (Fx, Fy, Fz) and moments (Mx, My, Mz) at the tire patch, replacing theoretical load estimates with empirical proving-ground data.",
      engineeringDeepDive: {
        problem:
          "Suspension and chassis components on off-road racing vehicles are frequently over-designed using arbitrary safety factors or under-designed due to unknown peak impact loads. Capturing true 6-DOF spindle loads during aggressive terrain events was critical to feed accurate boundary conditions into ANSYS structural simulations.",
        architecture:
          "Designed the Data Aquisition System (DAQ) & Mounting and integrated the Michigan Scientific 6-axis WFT into the vehicle's DAQ system. Configured ruggedized harness routing to survive full suspension articulation and mud/debris exposure. Built a custom Python telemetry decoding and visualization suite using pandas and matplotlib to parse raw hexadecimal CAN frames, apply scaling matrices, and synchronize force spikes with vehicle dynamics channels.",
        validation:
          "Executed dynamic field testing across rough terrain obstacles, successfully decoding multi-axis force and moment time-histories. The resulting empirical load cases directly govern the 2027 suspension geometry and structural FEA boundary conditions."
      },
      bom: [
        "Michigan Scientific 6-Axis Wheel Force Transducer",
        "Custom DAQ Firmware",
        "Custom Mount Designs",
        "Twisted-Pair Shielded CAN Bus Harness (120Ω Terminated)",
        "Custom Python Post-Processing Engine (pandas / pyqtgraph / PySide6)"
      ],
      media: [
        {
          url: "./assets/wft-hero.jpg",
          caption: "FIG 1.1 // 6-Axis Wheel Force Transducer mounted on the SAE Baja test vehicle hub assembly.",
          schematicType: "wft"
        },
        {
          url: "./assets/wft-telemetry.jpg",
          caption: "FIG 1.2 // Python (PySide6/pyqtgraph) multi-channel CAN log post-processing GUI showing Fx, Fy, Fz and Mz transients.",
          schematicType: "telemetry"
        }
      ],
      links: {
        github: "",
        report: ""
      }
    },

    {
      id: "SYS-02",
      title: "Accelerated Multi-Sensor Vehicle DAQ & CVT Validation System",
      category: "Test & DAQ",
      featured: true,
      status: "VALIDATED",
      date: "SEP 2026",
      subtitle: "End-to-end ESP32 telemetry logger combining Hall-effect RPM pulse counters, capacitive spark pickup, RaceBox Mini GNSS/IMU over BLE, and FATFS SD logging.",
      heroMetrics: [
        { label: "DEV CYCLE", value: "< 3 Weeks" },
        { label: "TELEMETRY", value: "25Hz GNSS + IMU + RPM" },
        { label: "FIRMWARE", value: "ESP-IDF C / FreeRTOS" }
      ],
      techStack: ["ESP32", "ESP-IDF (C)", "FreeRTOS", "BLE", "SPI / FATFS", "2N3904 Analog Front-End", "Python"],
      summary:
        "Architected, fabricated, and validated a complete standalone data acquisition system from scratch in under three weeks to characterize Continuously Variable Transmission (CVT) shift curves and vehicle acceleration performance to help the transmission team with their CVT design.",
      engineeringDeepDive: {
        problem:
          "Tuning a custom mechanical CVT requires simultaneous, time-synchronized logging of engine RPM (primary sheave), gearbox RPM (secondary sheave), longitudinal acceleration, and GPS velocity. Commercial motorsports loggers were cost-prohibitive and lacked native integration with our existing sensors.",
        architecture:
          "Built a dual-core ESP32 acquisition system in C (ESP-IDF). Interfaced gear-tooth Hall effect sensors via hardware pulse counters (PCNT) for secondary shaft rpm and Capacitive Inductive sensors for primary shaft rpm, implemented a Bluetooth Low Energy (BLE) client stack to capture 25Hz GNSS + IMU packets from a RaceBox Mini, and wrote non-blocking ring-buffered data streams to an SD card over SPI using FATFS.",
        validation:
          "Validated on-vehicle during dynamic CVT shift sweeps. Plotted primary vs. secondary RPM engagement curves alongside longitudinal G-force profiles in Python, enabling accurate acceleration model tuning and driving design for 2027 custom mechanical CVT."
      },
      bom: [
        "ESP32 Dual-Core MCU (ESP-IDF FreeRTOS Task Architecture)",
        "OEM Capacitive Inductive Sensor",
        "Ferrous Gear-Tooth Hall Effect Speed Sensors",
        "RaceBox Mini 25Hz GNSS / 6-Axis IMU (BLE GATT Stream)",
        "SPI MicroSD Card Interface (FATFS Binary/CSV Logging)"
      ],
      media: [
        {
          url: "./assets/daq-enclosure.jpg",
          caption: "FIG 2.1 // Standalone ESP32 DAQ hardware, harness integration, and custom 2N3904 capacitive RPM conditioning circuit.",
          schematicType: "daq"
        },
        {
          url: "./assets/cvt-curve.jpg",
          caption: "FIG 2.2 // Post-processed CVT shift curve (Engine RPM vs. Secondary Speed & GPS Velocity).",
          schematicType: "telemetry"
        }
      ],
      links: {
        github: "",
        report: ""
      }
    },

    {
      id: "SYS-03",
      title: "3HP Scotch Yoke Shock Dynamometer & Pneumatic Tire Rig FEA",
      category: "FEA, CFD & Mechanical",
      featured: true,
      status: "IN DEVELOPMENT",
      date: "OCT 2026",
      subtitle: "Pure-sinusoidal damper characterization bench, off-car pneumatic vertical tire stiffness rig, and ANSYS modal/structural validation of DAQ hardware.",
      heroMetrics: [
        { label: "DYNO DRIVE", value: "3.0 HP Scotch Yoke" },
        { label: "KINEMATICS", value: "Pure Sinusoidal" },
        { label: "DAQ MODE 1", value: "~319 Hz Natural Freq" }
      ],
      techStack: ["SolidWorks", "ANSYS Workbench", "ANSYS Static Structural", "ANSYS Modal", "Machine Design", "GD&T"],
      summary:
        "Designing and analyzing two cornerstone off-car mechanical characterization rigs for the 2027 vehicle cycle: a 3HP Scotch Yoke shock dynamometer for empirical damping curves and a pneumatic vertical tire stiffness rig.",
      engineeringDeepDive: {
        problem:
          "Conventional crank-slider shock dynos introduce connecting-rod angularity harmonics that distort force-velocity hysteresis loops at short strokes, while off-road tires lack published vertical spring rate data across varying inflation pressures. Simultaneously, custom vehicle DAQ mounts required vibration analysis to prevent resonance failure.",
        architecture:
          "Selected a Scotch Yoke mechanism driven by a 3HP motor to guarantee true sinusoidal displacement and velocity profiles (`x(t) = A·sin(ωt)`), isolating pure damper behavior. Concentrated structural engineering effort on resolving the high internal bending moments inherent to the yoke slide and linear guide rails. In parallel, modeled a pneumatic vertical tire stiffness testing frame in SolidWorks and conducted structural FEA deformation and modal natural frequency analysis across test rigs and custom DAQ enclosures in ANSYS Workbench.",
        validation:
          "Verified through ANSYS Modal analysis that custom DAQ enclosures achieve a Mode 1 natural frequency of ~319 Hz—well above engine firing and terrain excitation frequencies—preventing resonant fatigue and IMU noise saturation."
      },
      bom: [
        "3.0 HP AC Drive Motor & Variable Frequency Speed Control",
        "Precision Machined Scotch Yoke Pin & Linear Crosshead Guide Assembly",
        "Inline Tension/Compression Load Cell & Linear Potentiometer",
        "Pneumatic Actuator & Structural Steel Frame (Tire Stiffness Rig)",
        "ANSYS Static Structural & Modal Simulation Suite"
      ],
      media: [
        {
          url: "./assets/shock-dyno-cad.jpg",
          caption: "FIG 3.1 // Scotch Yoke vs. Crank-Slider kinematic and bending-moment structural evaluation.",
          schematicType: "dyno"
        },
        {
          url: "./assets/ansys-modal.jpg",
          caption: "FIG 3.2 // ANSYS Workbench Static Structural & Modal deformation contour (~319 Hz Mode 1).",
          schematicType: "fea"
        }
      ],
      links: {
        github: "",
        report: ""
      }
    },

    {
      id: "SYS-04",
      title: "Custom 4-Layer RP2040 Macropad with Machined Aluminum Encoders",
      category: "Embedded & PCB",
      featured: false,
      status: "IN DEVELOPMENT",
      date: "SEP 2026",
      subtitle: "Altium Designer 4-layer PCB layout, bare-metal RP2040 implementation, lathe-turned aluminum rotary knobs, and CF-PETG enclosure.",
      heroMetrics: [
        { label: "PCB STACKUP", value: "4-Layer Altium" },
        { label: "MCU CORE", value: "RP2040 Dual Cortex-M0+" },
        { label: "CHASSIS", value: "CF-PETG + Turned Al" }
      ],
      techStack: ["Altium Designer", "RP2040", "4-Layer PCB", "SolidWorks", "Manual Lathe Machining", "CF-PETG 3D Printing"],
      summary:
        "Designed and manufactured a bespoke 12-key programmable engineering macropad from the silicon level up, combining a custom 4-layer PCB in Altium Designer with manually lathe-machined aluminum hardware.",
      engineeringDeepDive: {
        problem:
          "Off-the-shelf input devices lacked programmable dual-encoder tactile control for timeline scrubbing, CAD viewport manipulation, and EDA shortcut workflows, while serving as an ideal benchmark for full-stack electromechanical product design.",
        architecture:
          "Designed a 4-layer PCB in Altium Designer featuring dedicated internal ground and power planes (Signal / GND / PWR / Signal), impedance-aware differential USB D+/D- routing, decoupled power rails, and an onboard RP2040 microcontroller with external QSPI flash and crystal oscillator. Modeled a rigid, low-profile enclosure in SolidWorks, printed it in carbon-fiber reinforced PETG on a Bambu Lab X1 Carbon, and manually machined custom knurled aluminum knobs on a lathe for the dual rotary encoders.",
        validation:
          "Reflow/hand-soldered SMT passives and IC packages, verified rail integrity with a multimeter, flashed custom firmware, and deployed the unit into daily CAD/EDA workstation service."
      },
      bom: [
        "Custom 4-Layer FR4 PCB (Designed in Altium Designer)",
        "Raspberry Pi RP2040 Dual-Core ARM Cortex-M0+ MCU + External QSPI Flash",
        "12x Mechanical Key Switches + 2x Quadrature Rotary Encoders",
        "Lathe-Machined 6061 Aluminum Encoder Knobs",
        "Bambu Lab X1C Carbon-Fiber PETG Enclosure"
      ],
      media: [
        {
          url: "./assets/macropad-pcb.jpg",
          caption: "FIG 4.1 // 4-Layer PCB routing and component placement in Altium Designer alongside assembled hardware.",
          schematicType: "pcb"
        }
      ],
      links: {
        github: "",
        report: ""
      }
    },

    {
      id: "SYS-05",
      title: "Electric Propulsion Naval Vessel: Hull CFD/FEA & Differential Thrust",
      category: "FEA, CFD & Mechanical",
      featured: false,
      status: "VALIDATED",
      date: "2026",
      subtitle: "Hydrodynamic hull drag optimization in STAR-CCM+, structural FEA in ANSYS, and embedded differential-thrust steering firmware for the PEP competition.",
      heroMetrics: [
        { label: "HYDRO CFD", value: "STAR-CCM+ Multiphase" },
        { label: "CONTROL", value: "Differential Thrust" },
        { label: "COMPETITION", value: "PEP Naval Design" }
      ],
      techStack: ["STAR-CCM+", "ANSYS Mechanical", "SolidWorks", "Embedded C/C++", "Propeller Optimization", "Sensor Fusion"],
      summary:
        "Cross-disciplinary mechanical and controls engineering for the Texas A&M Naval Design Team competing in Promoting Electrical Propulsion (PEP), spanning hull hydrodynamics, propeller efficiency, and twin-thruster steering firmware.",
      engineeringDeepDive: {
        problem:
          "Maximizing range and sprint velocity in electric marine competition requires simultaneous minimization of hydrodynamic hull drag, structural weight reduction, and crisp yaw authority without high-drag mechanical rudders.",
        architecture:
          "Executed multiphase VOF (Volume of Fluid) CFD simulations in STAR-CCM+ to evaluate hull waterlines, wave-making resistance, and propeller thrust/torque curves. Performed structural FEA in ANSYS to validate hull stiffness under hydrodynamic slamming loads. On the controls side, developed embedded differential-thrust steering firmware that modulates port and starboard propulsion command signals based on throttle and heading inputs.",
        validation:
          "Correlated CFD drag predictions with propulsion power budgets and validated responsive differential-thrust maneuvering logic across operational throttle regimes."
      },
      bom: [
        "Siemens STAR-CCM+ Hydrodynamic VOF CFD Models",
        "ANSYS Structural Hull Composite/Frame FEA",
        "Twin Electric Marine Thruster Differential Control Law",
        "Onboard Telemetry & Environmental Sensor Suite"
      ],
      media: [
        {
          url: "./assets/pep-cfd.jpg",
          caption: "FIG 5.1 // Hull hydrodynamic pressure distribution, free-surface wake profile, and differential thrust control vectoring.",
          schematicType: "cfd"
        }
      ],
      links: {
        github: "",
        report: ""
      }
    },

    {
      id: "SYS-06",
      title: "Register-Level Dual-Core ESP-IDF RC Vehicle over Wi-Fi UDP",
      category: "Embedded & PCB",
      featured: false,
      status: "VALIDATED",
      date: "AUG 2026",
      subtitle: "Deterministic dual-core C firmware utilizing ESP-IDF, low-latency Wi-Fi UDP sockets, hardware PWM timer registers, and standalone OLED telemetry hardware.",
      heroMetrics: [
        { label: "ARCHITECTURE", value: "Dual-Core FreeRTOS" },
        { label: "TRANSPORT", value: "Raw Wi-Fi UDP Sockets" },
        { label: "HAL LEVEL", value: "Register / ESP-IDF C" }
      ],
      techStack: ["ESP-IDF", "C", "FreeRTOS", "UDP Sockets", "MCPWM / LEDC Registers", "OLED Display", "SolidWorks"],
      summary:
        "Refactored a custom remote-operated vehicle platform (RC Car V2) from high-level Arduino abstractions down to deterministic, register-level ESP-IDF C firmware utilizing asymmetric dual-core task pinning and low-latency UDP sockets.",
      engineeringDeepDive: {
        problem:
          "Single-threaded polling loops and high-overhead HTTP/TCP protocols introduced unacceptable control latency and PWM jitter during high-speed steering and throttle transitions.",
        architecture:
          "Partitioned firmware execution across both Xtensa LX6 cores using FreeRTOS in ESP-IDF: Core 0 manages the Wi-Fi stack and non-blocking BSD UDP socket packet ingestion, while Core 1 executes deterministic motor H-bridge drive logic and 180-degree servo actuation via hardware timer registers. Complemented the platform with custom 3D-printed enclosures and an ESP32/OLED desktop companion module.",
        validation:
          "Eliminated packet-induced servo twitching and achieved sub-10ms command-to-actuator response across local wireless links."
      },
      bom: [
        "ESP32 Dual-Core Microcontroller (Core 0: Network // Core 1: Control)",
        "Hardware Timer PWM Actuation (180° calibrated MG996R Steering + Drive Stage)",
        "Low-Latency Raw UDP Packet Protocol over 802.11 Wi-Fi",
        "Custom 3D-Printed PETG Chassis & Companion OLED Hardware"
      ],
      media: [
        {
          url: "./assets/rc-esp-idf.jpg",
          caption: "FIG 6.1 // Dual-core FreeRTOS task partitioning and low-latency UDP control architecture.",
          schematicType: "pcb"
        }
      ],
      links: {
        github: "",
        report: ""
      }
    }
  ],

  /**
   * ==========================================================================
   * TECHNICAL CAPABILITIES MATRIX
   * ==========================================================================
   */
  capabilities: [
    {
      code: "DOM-01",
      domain: "CAD, FEA & CFD SIMULATION",
      description: "Structural load-path optimization, modal vibration isolation, and multiphase fluid dynamics.",
      tools: [
        "SolidWorks (3D CAD / Assemblies / Weldments / FEA)",
        "ANSYS Workbench",
        "ANSYS Static Structural",
        "ANSYS Modal (Natural Frequency / Resonance)",
        "ANSYS Fluent",
        "Fusion360"
      ]
    },
    {
      code: "DOM-02",
      domain: "EMBEDDED, PCB & HARDWARE",
      description: "Multi-layer board layout, bare-metal/RTOS firmware, and mixed-signal sensor conditioning.",
      tools: [
        "Hardware-In-The-Loop Testing (HIL)",
        "Software-In-The-Loop Testing (SIL)",
        "Altium Designer (4-Layer PCB Layout)",
        "ESP32 (ESP-IDF / FreeRTOS)",
        "STM32 (STM32 HAL)",
        "RP2040 (Dual Cortex-M0+)",
        "C / C++ / Rust / Python",
        "CAN Bus Architecture",
        "SPI / I2C / UART / BLE / Wi-Fi UDP / ADC",
        "Analog Signal Conditioning (Transistor / RC Stages)"
      ]
    },
    {
      code: "DOM-03",
      domain: "TELEMETRY, DAQ & CONTROLS",
      description: "Real-time vehicle instrumentation, custom GUI post-processing, and dynamic system modeling.",
      tools: [
        "Python (numpy / pandas / matplotlib)",
        "MATLAB",
        "6-Axis Wheel Force Transducer (WFT) Integration",
        "GNSS / IMU Sensor Fusion",
        "Hall Effect & Capacitive RPM Instrumentation",
        "Differential Thrust & Dynamic Controls",
        "Wireless Telemetry"
      ]
    },
    {
      code: "DOM-04",
      domain: "FABRICATION & TEST LAB",
      description: "Rapid composite prototyping, custom test rig manufacturing, and benchtop hardware bring-up.",
      tools: [
        "Bambu Lab X1 Carbon & A1 Mini (CF-PETG / PETG)",
        "Manual Lathe Machining",
        "Manual Mill Machining",
        "SMT & Through-Hole PCB Assembly / Rework",
        "Electrical Diagnostics & Harness Fabrication",
        "Linux Headless Server & Terminal Workflow"
      ]
    }
  ],

  /**
   * ==========================================================================
   * TRACK RECORD / TIMELINE
   * ==========================================================================
   */
  timeline: [
    {
      period: "2026 — PRESENT",
      role: "Lead Test Engineer & Hardware Integration",
      org: "Texas A&M SAE Baja Racing",
      badge: "Test Engineering & DAQ",
      highlights: [,
        "Led end to end development of Pneumatic Vertical Tire Stiffness rig",
        "Led integration of a Michigan Scientific 6-axis Wheel Force Transducer (WFT) and built custom Python CAN bus post-processing tools.",
        "Designed and deployed a standalone ESP32 + RaceBox BLE + SD FATFS telemetry logger in under 3 weeks for CVT validation.",
        "Currently engineering a 3HP Scotch Yoke shock dynamometer backed by ANSYS structural/modal FEA.",
        "Currently developing custom DAQ for 27' Baja car"
      ]
    },
    {
      period: "2026 — PRESENT",
      role: "Propulsion, CFD/FEA & Controls Engineer",
      org: "Texas A&M Naval Design Team — Promoting Electrical Propulsion (PEP)",
      badge: "HYDRODYNAMICS & FIRMWARE",
      highlights: [
        "Conducted boat hull CFD simulations and structural FEA in ANSYS to minimize drag and verify structural margins.",
        "Contributed to propeller optimization, onboard sensor suite integration, and embedded differential-thrust steering firmware.",
        "Led hardware integration for all electronic components on the boat"
      ]
    },
    {
      period: "FALL 2025 — MAY 2029 (EXPECTED)",
      role: "B.S. in Mechanical Engineering (Minor in Electrical Engineering)",
      org: "Texas A&M University — College Station, TX",
      badge: "4.00 CUMULATIVE GPA",
      highlights: [
        "Maintaining a 4.00 GPA with Junior standing by credit hours and Sophomore standing by cohort year.",
        "Active member of the American Society of Mechanical Engineers (ASME) Texas A&M Chapter; targeting FE/PE licensure upon graduation.",
        "Transitioned from 7 years of competitive Texas 5A D2 State Championship high school football into self-driven full-stack hardware and mechanical engineering."
      ]
    }
  ]
};

/**
 * ============================================================================
 *CUSTOM SVG CAD/TELEMETRY SCHEMATIC GENERATOR
 * Ensures every project card and modal looks like a McLaren/Lockheed blueprint
 * even before you drop your local `.jpg`/`.png` photos into `/assets/`.
 * ============================================================================
 */
function generateBlueprintSVG(type, projectId) {
  const commonGrid = `
    <defs>
      <pattern id="smallGrid-${projectId}" width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#18191C" stroke-width="0.7"/>
      </pattern>
      <pattern id="Grid-${projectId}" width="80" height="80" patternUnits="userSpaceOnUse">
        <rect width="80" height="80" fill="url(#smallGrid-${projectId})"/>
        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#23252A" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="800" height="450" fill="#070709"/>
    <rect width="800" height="450" fill="url(#Grid-${projectId})"/>
    <!-- CAD Title Block Frame -->
    <rect x="16" y="16" width="768" height="418" fill="none" stroke="#2E3138" stroke-width="1"/>
    <line x1="16" y1="394" x2="784" y2="394" stroke="#2E3138" stroke-width="1"/>
    <text x="28" y="415" fill="#8E9299" font-family="JetBrains Mono, monospace" font-size="11" letter-spacing="1.5">DWG NO: ${projectId} // SCALE: 1:1 // UNITS: SI (MM/N/HZ)</text>
    <text x="615" y="415" fill="#FF6B00" font-family="JetBrains Mono, monospace" font-size="11" letter-spacing="1.5">TELEMETRY SPEC // REV A</text>
  `;

  let diagram = "";

  if (type === "wft") {
    diagram = `
      <!-- 6-Axis WFT Hub & Force Vectors -->
      <g transform="translate(400, 200)">
        <circle cx="0" cy="0" r="115" fill="none" stroke="#383B42" stroke-width="1.5" stroke-dasharray="6 4"/>
        <circle cx="0" cy="0" r="82" fill="#0D0E12" stroke="#8E9299" stroke-width="2"/>
        <circle cx="0" cy="0" r="36" fill="#070709" stroke="#FF6B00" stroke-width="2"/>
        <!-- 6 Load Cell Struts -->
        <line x1="0" y1="-36" x2="0" y2="-82" stroke="#FF6B00" stroke-width="3"/>
        <line x1="31" y1="-18" x2="71" y2="-41" stroke="#FF6B00" stroke-width="3"/>
        <line x1="31" y1="18" x2="71" y2="41" stroke="#FF6B00" stroke-width="3"/>
        <line x1="0" y1="36" x2="0" y2="82" stroke="#FF6B00" stroke-width="3"/>
        <line x1="-31" y1="18" x2="-71" y2="41" stroke="#FF6B00" stroke-width="3"/>
        <line x1="-31" y1="-18" x2="-71" y2="-41" stroke="#FF6B00" stroke-width="3"/>
        <!-- Coordinate Axes -->
        <line x1="0" y1="0" x2="0" y2="-145" stroke="#10B981" stroke-width="2"/>
        <polygon points="0,-152 -5,-140 5,-140" fill="#10B981"/>
        <text x="10" y="-140" fill="#10B981" font-family="JetBrains Mono" font-size="12">+Fz (VERTICAL LOAD)</text>
        <line x1="0" y1="0" x2="165" y2="0" stroke="#FF6B00" stroke-width="2"/>
        <polygon points="172,0 160,-5 160,5" fill="#FF6B00"/>
        <text x="115" y="-10" fill="#FF6B00" font-family="JetBrains Mono" font-size="12">+Fx (TRACTION)</text>
        <line x1="0" y1="0" x2="-95" y2="65" stroke="#EDEDEF" stroke-width="2"/>
        <text x="-175" y="82" fill="#EDEDEF" font-family="JetBrains Mono" font-size="12">+Fy (LATERAL) / Mz</text>
      </g>
    `;
  } else if (type === "daq" || type === "telemetry") {
    diagram = `
      <!-- Multi-Channel Telemetry Waveforms -->
      <g transform="translate(60, 70)">
        <rect x="0" y="0" width="680" height="280" fill="#0A0B0E" stroke="#262930"/>
        <line x1="0" y1="140" x2="680" y2="140" stroke="#1E2026" stroke-dasharray="4 4"/>
        <!-- RPM Curve -->
        <path d="M 20 240 Q 110 230, 160 110 T 340 85 T 520 65 L 660 55" fill="none" stroke="#FF6B00" stroke-width="2.5"/>
        <!-- Secondary Speed Curve -->
        <path d="M 20 255 Q 150 250, 230 190 T 440 120 L 660 78" fill="none" stroke="#10B981" stroke-width="2"/>
        <!-- High-freq IMU trace -->
        <path d="M 20 155 L 50 135 L 80 165 L 110 120 L 140 170 L 170 130 L 200 155 L 230 140 L 260 160 L 290 125 L 320 158 L 350 138 L 380 152 L 410 130 L 440 162 L 470 139 L 500 150 L 530 132 L 560 155 L 590 141 L 620 149 L 660 140" fill="none" stroke="#8E9299" stroke-width="1.2" opacity="0.8"/>
        <text x="20" y="30" fill="#FF6B00" font-family="JetBrains Mono" font-size="11">CH1: PRIMARY ENGINE RPM (2N3904 CAPACITIVE PICKUP) // 3850 RPM</text>
        <text x="20" y="50" fill="#10B981" font-family="JetBrains Mono" font-size="11">CH2: SECONDARY CVT SHAFT (HALL PCNT) + 25HZ RACEBOX GNSS</text>
      </g>
    `;
  } else if (type === "dyno" || type === "fea") {
    diagram = `
      <!-- Scotch Yoke Mechanism & FEA Modal Mesh -->
      <g transform="translate(230, 205)">
        <circle cx="0" cy="0" r="85" fill="none" stroke="#8E9299" stroke-width="1.5" stroke-dasharray="5 5"/>
        <circle cx="0" cy="0" r="12" fill="#FF6B00"/>
        <line x1="0" y1="0" x2="60" y2="-60" stroke="#EDEDEF" stroke-width="4"/>
        <circle cx="60" cy="-60" r="10" fill="#FF6B00" stroke="#070709" stroke-width="2"/>
        <!-- Yoke Slot -->
        <rect x="44" y="-110" width="32" height="220" fill="none" stroke="#FF6B00" stroke-width="2.5"/>
        <!-- Sinusoidal Output Shaft -->
        <line x1="76" y1="0" x2="290" y2="0" stroke="#10B981" stroke-width="4"/>
        <!-- Damper Cylinder -->
        <rect x="290" y="-28" width="120" height="56" fill="#111318" stroke="#EDEDEF" stroke-width="2"/>
        <text x="-95" y="125" fill="#EDEDEF" font-family="JetBrains Mono" font-size="11">3HP SCOTCH YOKE: x(t) = A·sin(ωt) // MODE 1: 319.4 HZ</text>
      </g>
    `;
  } else if (type === "pcb") {
    diagram = `
      <!-- 4-Layer PCB Routing Blueprint -->
      <g transform="translate(150, 65)">
        <rect x="0" y="0" width="500" height="290" rx="12" fill="#0B0D11" stroke="#FF6B00" stroke-width="2"/>
        <!-- RP2040 Central Package -->
        <rect x="210" y="105" width="80" height="80" fill="#14171F" stroke="#EDEDEF" stroke-width="1.5"/>
        <text x="223" y="149" fill="#FF6B00" font-family="JetBrains Mono" font-size="12">RP2040</text>
        <!-- Differential Traces -->
        <path d="M 250 105 L 250 40 L 310 15" fill="none" stroke="#FF6B00" stroke-width="2"/>
        <path d="M 258 105 L 258 44 L 316 19" fill="none" stroke="#FF6B00" stroke-width="2"/>
        <path d="M 210 145 L 120 145 L 85 95" fill="none" stroke="#10B981" stroke-width="2"/>
        <path d="M 290 145 L 385 145 L 420 205" fill="none" stroke="#10B981" stroke-width="2"/>
        <!-- Rotary Encoders -->
        <circle cx="85" cy="75" r="28" fill="#070709" stroke="#8E9299" stroke-width="2"/>
        <circle cx="415" cy="75" r="28" fill="#070709" stroke="#8E9299" stroke-width="2"/>
        <text x="24" y="270" fill="#8E9299" font-family="JetBrains Mono" font-size="11">4-LAYER STACKUP: TOP SIG // GND PLANE // 3V3 PWR // BOT SIG</text>
      </g>
    `;
  } else {
    diagram = `
      <!-- CFD Streamlines -->
      <g transform="translate(80, 95)">
        <path d="M 20 110 Q 220 20, 580 110 Q 220 200, 20 110 Z" fill="#10131A" stroke="#EDEDEF" stroke-width="2"/>
        <path d="M 0 65 Q 230 -15, 640 65" fill="none" stroke="#FF6B00" stroke-width="2"/>
        <path d="M 0 155 Q 230 235, 640 155" fill="none" stroke="#FF6B00" stroke-width="2"/>
        <path d="M 0 35 Q 240 -35, 640 35" fill="none" stroke="#10B981" stroke-width="1.5" stroke-dasharray="6 4"/>
        <path d="M 0 185 Q 240 255, 640 185" fill="none" stroke="#10B981" stroke-width="1.5" stroke-dasharray="6 4"/>
        <text x="150" y="245" fill="#FF6B00" font-family="JetBrains Mono" font-size="11">STAR-CCM+ MULTIPHASE VOF // DIFFERENTIAL THRUST VECTORING</text>
      </g>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">${commonGrid}${diagram}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * ============================================================================
 * APPLICATION INITIALIZATION & DOM RENDERING
 * ============================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
  renderHeroAndProfile();
  renderFilterBar();
  renderProjects("ALL");
  renderCapabilities();
  renderTimeline();
  initTelemetryCanvas();
  initModalHandlers();
  initLiveClock();
});

function renderHeroAndProfile() {
  const { profile } = PORTFOLIO_DATA;

  document.getElementById("nav-handle").textContent = profile.handle;
  document.getElementById("hero-location").textContent = profile.location;
  document.getElementById("hero-status").textContent = profile.status;
  document.getElementById("hero-tagline").textContent = profile.tagline;
  document.getElementById("hero-headline").textContent = profile.headline;
  document.getElementById("hero-subheadline").textContent = profile.subheadline;

  // Resume & Contact Links
  document.querySelectorAll(".js-resume-link").forEach((el) => {
    el.href = profile.resumeUrl;
  });
  document.querySelectorAll(".js-email-link").forEach((el) => {
    el.href = `mailto:${profile.email}`;
  });
  document.getElementById("footer-email").textContent = profile.email;

  // Render 4-Column Spec Strip
  const specStrip = document.getElementById("hero-spec-strip");
  specStrip.innerHTML = profile.heroSpecs
    .map(
      (spec) => `
      <div class="spec-cell">
        <div class="spec-code">${spec.code}</div>
        <div class="spec-label">${spec.label}</div>
        <div class="spec-value">${spec.value}</div>
        <div class="spec-sub">${spec.sub}</div>
      </div>
    `
    )
    .join("");
}

function renderFilterBar() {
  const categories = ["ALL", ...new Set(PORTFOLIO_DATA.projects.map((p) => p.category))];
  const filterContainer = document.getElementById("project-filters");

  filterContainer.innerHTML = categories
    .map(
      (cat, idx) => `
      <button class="filter-btn ${idx === 0 ? "active" : ""}" data-category="${cat}">
        <span class="filter-indicator"></span>
        ${cat.toUpperCase()}
        <span class="filter-count">[${
          cat === "ALL"
            ? PORTFOLIO_DATA.projects.length
            : PORTFOLIO_DATA.projects.filter((p) => p.category === cat).length
        }]</span>
      </button>
    `
    )
    .join("");

  filterContainer.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      filterContainer.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderProjects(btn.dataset.category);
    });
  });
}

function renderProjects(selectedCategory) {
  const grid = document.getElementById("projects-grid");
  const filtered =
    selectedCategory === "ALL"
      ? PORTFOLIO_DATA.projects
      : PORTFOLIO_DATA.projects.filter((p) => p.category === selectedCategory);

  grid.innerHTML = filtered
    .map((project) => {
      const primaryMedia = project.media && project.media[0];
      const fallbackSvg = generateBlueprintSVG(
        primaryMedia ? primaryMedia.schematicType : "daq",
        project.id
      );
      const statusClass =
        project.status === "VALIDATED" ? "status-validated" : "status-dev";

      return `
        <article class="project-card ${project.featured ? "project-card-featured" : ""}" data-project-id="${project.id}" tabindex="0" role="button" aria-label="Inspect ${project.title}">
          <div class="card-crosshair top-left">+</div>
          <div class="card-crosshair top-right">+</div>
          <div class="card-crosshair bottom-left">+</div>
          <div class="card-crosshair bottom-right">+</div>

          <div class="card-header">
            <div class="card-serial">
              <span class="papaya-dot"></span>
              <span>${project.id} // ${project.category.toUpperCase()}</span>
            </div>
            <div class="card-badges">
              <span class="card-date">${project.date}</span>
              <span class="status-pill ${statusClass}">${project.status}</span>
            </div>
          </div>

          <div class="card-media-wrap">
            <img
              src="${primaryMedia ? primaryMedia.url : fallbackSvg}"
              onerror="this.onerror=null; this.src='${fallbackSvg}';"
              alt="${project.title}"
              class="card-img"
              loading="lazy"
            />
            <div class="card-media-overlay">
              <span>INSPECT ENGINEERING DOSSIER [ENTER]</span>
            </div>
          </div>

          <div class="card-body">
            <h3 class="card-title">${project.title}</h3>
            <p class="card-subtitle">${project.subtitle}</p>

            <div class="card-metrics-grid">
              ${project.heroMetrics
                .map(
                  (m) => `
                  <div class="metric-box">
                    <span class="metric-label">${m.label}</span>
                    <span class="metric-val">${m.value}</span>
                  </div>
                `
                )
                .join("")}
            </div>

            <div class="card-footer">
              <div class="tag-list">
                ${project.techStack
                  .slice(0, 5)
                  .map((t) => `<span class="tech-tag">${t}</span>`)
                  .join("")}
              </div>
              <span class="inspect-cta">DOSSIER &rarr;</span>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  // Attach click & keyboard listeners to open Engineering Dossier Modal
  grid.querySelectorAll(".project-card").forEach((card) => {
    const triggerOpen = () => openProjectModal(card.dataset.projectId);
    card.addEventListener("click", triggerOpen);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        triggerOpen();
      }
    });
  });
}

function renderCapabilities() {
  const container = document.getElementById("capabilities-grid");
  container.innerHTML = PORTFOLIO_DATA.capabilities
    .map(
      (cap) => `
      <div class="cap-card">
        <div class="cap-header">
          <span class="cap-code">${cap.code}</span>
          <h3 class="cap-title">${cap.domain}</h3>
        </div>
        <p class="cap-desc">${cap.description}</p>
        <div class="cap-tools">
          ${cap.tools
            .map(
              (tool) => `
              <div class="cap-tool-item">
                <span class="tool-bullet"></span>
                <span>${tool}</span>
              </div>
            `
            )
            .join("")}
        </div>
      </div>
    `
    )
    .join("");
}

function renderTimeline() {
  const container = document.getElementById("timeline-list");
  container.innerHTML = PORTFOLIO_DATA.timeline
    .map(
      (item) => `
      <div class="timeline-row">
        <div class="timeline-meta">
          <div class="timeline-period">${item.period}</div>
          <div class="timeline-badge">${item.badge}</div>
        </div>
        <div class="timeline-content">
          <h3 class="timeline-role">${item.role}</h3>
          <div class="timeline-org">${item.org}</div>
          <ul class="timeline-bullets">
            ${item.highlights.map((h) => `<li>${h}</li>`).join("")}
          </ul>
        </div>
      </div>
    `
    )
    .join("");
}

/**
 * ============================================================================
 * ENGINEERING DOSSIER MODAL ENGINE
 * ============================================================================
 */
let activeModalProject = null;
let activeMediaIndex = 0;

function openProjectModal(projectId) {
  const project = PORTFOLIO_DATA.projects.find((p) => p.id === projectId);
  if (!project) return;

  activeModalProject = project;
  activeMediaIndex = 0;

  document.getElementById("modal-id").textContent = `${project.id} // ${project.category.toUpperCase()}`;
  document.getElementById("modal-status").textContent = `${project.status} // ${project.date}`;
  document.getElementById("modal-title").textContent = project.title;
  document.getElementById("modal-summary").textContent = project.summary;

  document.getElementById("modal-problem").textContent = project.engineeringDeepDive.problem;
  document.getElementById("modal-architecture").textContent = project.engineeringDeepDive.architecture;
  document.getElementById("modal-validation").textContent = project.engineeringDeepDive.validation;

  // Metrics
  document.getElementById("modal-metrics").innerHTML = project.heroMetrics
    .map(
      (m) => `
      <div class="modal-metric-cell">
        <span class="metric-label">${m.label}</span>
        <span class="metric-val">${m.value}</span>
      </div>
    `
    )
    .join("");

  // BOM / Hardware List
  document.getElementById("modal-bom").innerHTML = (project.bom || [])
    .map((item) => `<li>${item}</li>`)
    .join("");

  // Stack tags
  document.getElementById("modal-tags").innerHTML = project.techStack
    .map((t) => `<span class="tech-tag">${t}</span>`)
    .join("");

  updateModalMedia();

  const modal = document.getElementById("dossier-modal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function updateModalMedia() {
  if (!activeModalProject) return;
  const mediaList = activeModalProject.media || [];
  const current = mediaList[activeMediaIndex] || {
    url: "",
    caption: "Technical Schematic",
    schematicType: "daq"
  };

  const fallbackSvg = generateBlueprintSVG(
    current.schematicType || "daq",
    activeModalProject.id
  );

  const imgEl = document.getElementById("modal-img");
  imgEl.onerror = () => {
    imgEl.onerror = null;
    imgEl.src = fallbackSvg;
  };
  imgEl.src = current.url || fallbackSvg;

  document.getElementById("modal-caption").textContent = current.caption;

  // Media Thumbnails / Selector
  const thumbsContainer = document.getElementById("modal-thumbs");
  if (mediaList.length > 1) {
    thumbsContainer.style.display = "flex";
    thumbsContainer.innerHTML = mediaList
      .map(
        (m, idx) => `
        <button class="media-step-btn ${idx === activeMediaIndex ? "active" : ""}" data-idx="${idx}">
          FIG 0${idx + 1}
        </button>
      `
      )
      .join("");

    thumbsContainer.querySelectorAll(".media-step-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeMediaIndex = Number(btn.dataset.idx);
        updateModalMedia();
      });
    });
  } else {
    thumbsContainer.style.display = "none";
  }
}

function closeProjectModal() {
  const modal = document.getElementById("dossier-modal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function initModalHandlers() {
  document.getElementById("modal-close-btn").addEventListener("click", closeProjectModal);
  document.getElementById("modal-backdrop").addEventListener("click", closeProjectModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProjectModal();
  });
}

/**
 * ============================================================================
 * 60FPS INTERACTIVE TELEMETRY & SCOTCH YOKE HARMONIC CANVAS
 * Simulates a live dual-channel damper force-velocity trace + CAN frame monitor
 * ============================================================================
 */
function initTelemetryCanvas() {
  const canvas = document.getElementById("telemetry-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = 0;
  let height = 0;
  let phase = 0;
  let targetFreq = 0.032;
  let currentFreq = 0.032;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener("resize", resize);
  resize();

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width;
    targetFreq = 0.02 + normX * 0.055;
  });

  canvas.addEventListener("mouseleave", () => {
    targetFreq = 0.032;
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Subtle oscilloscope grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    const step = 36;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Center zero-reference line
    const midY = height * 0.54;
    ctx.strokeStyle = "rgba(255, 107, 0, 0.18)";
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();

    currentFreq += (targetFreq - currentFreq) * 0.08;
    phase += currentFreq * 2.2;

    // Channel 1: Pure Sinusoidal Scotch Yoke Displacement x(t) = A*sin(wt)
    ctx.strokeStyle = "#FF6B00";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    const amp1 = height * 0.25;
    for (let x = 0; x < width; x++) {
      const y = midY + Math.sin(x * currentFreq - phase) * amp1;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Channel 2: Velocity / Damping Force Derivative v(t) = A*w*cos(wt) + structural harmonic
    ctx.strokeStyle = "#10B981";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const amp2 = height * 0.17;
    for (let x = 0; x < width; x++) {
      const y =
        midY +
        Math.cos(x * currentFreq - phase) * amp2 +
        Math.sin(x * currentFreq * 3.0 - phase * 1.5) * 8;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Live Readout Update
    const hzVal = (currentFreq * 145).toFixed(1);
    const hzEl = document.getElementById("live-hz-readout");
    if (hzEl) {
      hzEl.textContent = `CH1: x(t) SINUSOIDAL // CH2: F_d(t) // ${hzVal} HZ`;
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

function initLiveClock() {
  const clockEl = document.getElementById("hud-clock");
  if (!clockEl) return;
  const update = () => {
    const now = new Date();
    clockEl.textContent = now.toISOString().replace("T", " ").substring(0, 19) + " UTC";
  };
  update();
  setInterval(update, 1000);
}