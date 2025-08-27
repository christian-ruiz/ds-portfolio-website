// src/data/projects.js
export const PROJECTS = [
    {
      id: "orbital-ode-visualizer",
      title: "Orbital Dynamics ODE Visualizer",
      date: "2025-06-05",
      tags: ["python", "matplotlib", "odeint", "visualization"],
      summary:
        "Numerically integrate Earth's orbital equations with SciPy odeint and build interactive visualizations to explore parameter sensitivity.",
      links: {
        code: "https://github.com/christian-ruiz/orbital-ode-visualizer",
        demo: "#",
      },
      paper: {
        abstract:
          "We model circular and perturbed orbits…",
        data:
          "Synthetic initial conditions; Astronomical constants from JPL/HORIZONS; No PII.",
        methods:
          "SciPy odeint; numpy; matplotlib; tests for invariants.",
        approach:
          "Baseline circular → add eccentricity → perturbations → compare errors.",
        findings:
          "odeint stable for Δt ≤ 60s; energy drift grows with eccentricity.",
        conclusions:
          "Consider symplectic integrators; n-body extension.",
      },
    },
    {
      id: "options-iv-vs-hv",
      title: "Options Implied Volatility vs Historical Volatility",
      date: "2025-06-11",
      tags: ["finance", "options", "black-scholes", "ibkr", "python"],
      summary:
        "Compute IV and compare to 252-day HV; explore IV−HV signal and backtest feasibility.",
      links: {
        code: "https://github.com/christian-ruiz/iv-vs-hv",
        demo: "#",
      },
      paper: {
        abstract: "We compute IV across strikes/expirations and contrast with HV…",
        data: "IBKR API; UST rates; tickers AAPL, SPY, TQQQ.",
        methods: "Black-Scholes IV (Brent), HV, robust z-scores, slippage-aware backtest.",
        approach: "Daily IV surface → HV grid → Δ=IV−HV → paper trading.",
        findings: "Spreads cluster near earnings; naive fade erodes with slippage.",
        conclusions: "Add filters and execution constraints.",
      },
    },
    {
      id: "mortgage-lead-pipeline",
      title: "Mortgage Lead ETL & Scoring (Ruiz Family Capital)",
      date: "2025-08-01",
      tags: ["monday.com", "api", "etl", "classification", "business"],
      summary:
        "Webhook ETL from LeadMailbox → Monday.com; scoring and SLA dashboard.",
      links: {
        code: "https://github.com/christian-ruiz/mortgage-lead-pipeline",
        demo: "#",
      },
      paper: {
        abstract: "Design a small-scale CRM data pipeline + lightweight scoring.",
        data: "LeadMailbox; Monday.com boards; ACS enrichment.",
        methods: "FastAPI, Pydantic, XGBoost, SHAP, Grafana.",
        approach: "Ingestion → features → score → board updates → alerts.",
        findings: "Response <5min correlates with +18–25% conversion; top quartile 2.1×.",
        conclusions: "A/B test scripts; add attribution + LTV/CAC.",
      },
    },
  ];