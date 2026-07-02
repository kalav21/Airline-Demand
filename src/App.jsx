import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import RequestDemoModal from "./components/RequestDemoModal";

const navItems = [
  ["Overview", "#overview"],
  ["Visuals", "#visuals"],
  ["Dashboard", "#dashboard"],
  ["Operations", "#operations"],
  ["Results", "#results"],
  ["About", "#about"]
];

const projectImages = [
  {
    src: "/project-images/Exploratory-Data-Analysis.png",
    title: "Travel Demand Exploration",
    caption:
      "Exploratory analysis used to understand customer search behavior, route interest, and destination demand signals."
  },
  {
    src: "/project-images/Operational%20Data%20Insights.png",
    title: "Operational Data Insights",
    caption:
      "Operational analysis view for connecting airport conditions, delay patterns, and turn-time performance."
  },
  {
    src: "/project-images/challenge1_results.png",
    title: "Two-Region Prediction Results",
    caption:
      "Model results comparing prediction performance for a simplified regional demand classification task."
  },
  {
    src: "/project-images/challenge2_results.png",
    title: "Four-Region Prediction Results",
    caption:
      "Performance summary for a broader regional classification workflow supporting destination demand analysis."
  },
  {
    src: "/project-images/station_type_performance.png",
    title: "Station Type Performance",
    caption:
      "Turn-time performance analysis showing how operational outcomes may differ across airport station types."
  },
  {
    src: "/project-images/final-results.png",
    title: "Final Model Summary",
    caption:
      "Final results table used to communicate model accuracy, tradeoffs, and business-facing takeaways."
  }
];

const metrics = [
  [
    "400,000+",
    "Travel Search Records",
    "Large-scale search behavior analyzed to identify destination demand patterns."
  ],
  [
    "Demand",
    "Destination Prediction",
    "Classification models used to estimate likely destination regions and airport choices."
  ],
  [
    "Ops",
    "Turn-Time Analysis",
    "Operational fields explored to understand factors associated with longer aircraft turns."
  ],
  [
    "1st",
    "First-Place Team Project",
    "Competition project combining machine learning, reporting, and dashboard communication."
  ],
  [
    "ML + BI",
    "Modeling And Dashboards",
    "Predictive workflows translated into charts, tables, and stakeholder-ready summaries."
  ]
];

const dataSteps = [
  [
    "Data import",
    "Imported and organized travel search and operational datasets for repeatable analysis."
  ],
  [
    "Record cleaning",
    "Handled missing, incomplete, and inconsistent fields before modeling or reporting."
  ],
  [
    "Mapping",
    "Created region, airport, station type, and category mappings for clearer interpretation."
  ],
  [
    "Feature engineering",
    "Prepared search, booking, seasonal, airport, delay, and operational fields for analysis."
  ],
  [
    "Model-ready data",
    "Structured datasets for baseline models, tuned models, and challenge-level evaluation."
  ],
  [
    "Dashboard summaries",
    "Designed business-readable summaries for planning, operations, and non-technical review."
  ]
];

const fieldRows = [
  ["origin_airport", "Starting airport or market used in a travel search"],
  ["destination", "Requested destination airport or city"],
  ["destination_region", "Mapped region used for demand grouping and classification"],
  ["search_month", "Month or seasonal period of search activity"],
  ["search_count", "Number of customer search events"],
  ["booking_count", "Estimated or observed downstream booking activity"],
  ["station_type", "Airport station category used in operational comparison"],
  ["turn_time_minutes", "Observed or calculated aircraft turn-time duration"],
  ["delay_code", "Operational delay category associated with a flight event"],
  ["demand_category", "Low, medium, or high demand label for reporting"]
];

const challenges = [
  {
    title: "Challenge 1",
    subtitle: "Two-region classification",
    accuracy: "80%",
    body:
      "A simplified regional prediction task that showed strong baseline signal in travel search behavior."
  },
  {
    title: "Challenge 2",
    subtitle: "Four-region classification",
    accuracy: "78%",
    body:
      "A more detailed regional model that preserved useful accuracy while supporting richer route-demand interpretation."
  },
  {
    title: "Challenge 3",
    subtitle: "Specific airport prediction",
    accuracy: "33%",
    body:
      "A harder many-class airport prediction task that required tuning and fallback logic for sparse destination cases."
  }
];

const insights = [
  "Travel search behavior can reveal early signals of destination demand before bookings fully materialize.",
  "Regional prediction helps simplify complex route-demand patterns into categories that planning teams can interpret.",
  "Turn-time analysis can help identify operational bottlenecks across airport types, seasons, and delay categories.",
  "Dashboards help communicate complex airline data to technical, business, and operations teams.",
  "Clean data preparation is essential before modeling, reporting, or using analytics for decision support."
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const origins = ["All origins", "JFK", "LAX", "DFW", "ORD"];
const regions = ["All regions", "Northeast", "West", "South", "International"];
const metricsForDashboard = ["Searches", "Bookings", "Conversion"];

const originWeights = {
  "All origins": 1,
  JFK: 1.18,
  LAX: 1.08,
  DFW: 0.98,
  ORD: 0.9
};

const regionWeights = {
  "All regions": 1,
  Northeast: 0.9,
  West: 1.12,
  South: 1.02,
  International: 1.24
};

const conversionRates = {
  "All regions": 0.121,
  Northeast: 0.118,
  West: 0.132,
  South: 0.126,
  International: 0.109
};

const monthRateLift = {
  Jan: -0.006,
  Feb: -0.002,
  Mar: 0.001,
  Apr: 0.004,
  May: 0.007,
  Jun: 0.01
};

const baseDemandData = [
  { month: "Jan", Northeast: 7800, West: 9100, South: 8500, International: 6200 },
  { month: "Feb", Northeast: 8400, West: 9600, South: 8800, International: 7000 },
  { month: "Mar", Northeast: 9200, West: 11200, South: 9700, International: 8200 },
  { month: "Apr", Northeast: 9800, West: 11900, South: 10400, International: 8700 },
  { month: "May", Northeast: 10700, West: 12800, South: 11100, International: 9600 },
  { month: "Jun", Northeast: 11600, West: 13900, South: 12100, International: 10800 }
];

const routeSeeds = [
  { route: "JFK -> West", region: "West", searches: 12400, bookings: 1650 },
  { route: "LAX -> International", region: "International", searches: 11800, bookings: 1420 },
  { route: "DFW -> South", region: "South", searches: 10600, bookings: 1360 },
  { route: "ORD -> Northeast", region: "Northeast", searches: 9300, bookings: 1210 },
  { route: "JFK -> International", region: "International", searches: 8900, bookings: 1050 }
];

const stationTurnData = [
  { station: "Hub", turnTime: 51, lateDeparture: 18 },
  { station: "Focus city", turnTime: 58, lateDeparture: 23 },
  { station: "Regional", turnTime: 46, lateDeparture: 15 },
  { station: "International", turnTime: 67, lateDeparture: 29 }
];

const operationalFactorData = [
  { factor: "Boarding", minutes: 12 },
  { factor: "Baggage", minutes: 10 },
  { factor: "Sanitation", minutes: 8 },
  { factor: "Crew", minutes: 7 },
  { factor: "Weather", minutes: 6 }
];

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

function getConversionRate(region, month = "All months") {
  return conversionRates[region] + (monthRateLift[month] ?? 0);
}

function scaleMetric(searches, metric, conversionRate) {
  if (metric === "Bookings") return Math.round(searches * conversionRate);
  if (metric === "Conversion") return Number((conversionRate * 100).toFixed(1));
  return Math.round(searches);
}

function App() {
  const [selectedMonth, setSelectedMonth] = useState("All months");
  const [selectedOrigin, setSelectedOrigin] = useState("All origins");
  const [selectedRegion, setSelectedRegion] = useState("All regions");
  const [selectedMetric, setSelectedMetric] = useState("Searches");
  const [activeImage, setActiveImage] = useState(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);

  const dashboardData = useMemo(() => {
    // Replace these sample arrays with parsed CSV rows, static JSON, or API data when real data is available.
    const originFactor = originWeights[selectedOrigin];
    const regionFactor = regionWeights[selectedRegion];
    const monthFactor = selectedMonth === "All months" ? 1 : 0.92 + months.indexOf(selectedMonth) * 0.035;

    const lineData = baseDemandData
      .filter((row) => selectedMonth === "All months" || row.month === selectedMonth)
      .map((row) => {
        const regionTotal =
          selectedRegion === "All regions"
            ? row.Northeast + row.West + row.South + row.International
            : row[selectedRegion];

        return {
          month: row.month,
          value: scaleMetric(
            regionTotal * originFactor * regionFactor,
            selectedMetric,
            getConversionRate(selectedRegion, row.month)
          )
        };
      });

    const regionData = ["Northeast", "West", "South", "International"].map((region) => {
      const total = baseDemandData
        .filter((row) => selectedMonth === "All months" || row.month === selectedMonth)
        .reduce((sum, row) => sum + row[region], 0);

      return {
        region,
        value: scaleMetric(
          total * originFactor * regionWeights[region],
          selectedMetric,
          getConversionRate(region, selectedMonth)
        )
      };
    });

    const routeData = routeSeeds
      .filter((row) => selectedRegion === "All regions" || row.region === selectedRegion)
      .map((row) => {
        const searchValue = row.searches * originFactor * monthFactor;
        return {
          ...row,
          searches: Math.round(searchValue),
          bookings: Math.round(row.bookings * originFactor * monthFactor),
          conversion: `${((row.bookings / row.searches) * 100).toFixed(1)}%`
        };
      })
      .sort((a, b) => b.searches - a.searches);

    const stationData = stationTurnData.map((row) => ({
      ...row,
      turnTime: Math.round(row.turnTime * (selectedMonth === "All months" ? 1 : monthFactor))
    }));

    const factorData = operationalFactorData.map((row, index) => ({
      ...row,
      minutes: Math.round(row.minutes * (1 + index * 0.03) * monthFactor)
    }));

    return { lineData, regionData, routeData, stationData, factorData };
  }, [selectedMonth, selectedOrigin, selectedRegion, selectedMetric]);

  const metricSuffix = selectedMetric === "Conversion" ? "%" : "";

  return (
    <div className="min-h-screen bg-slate-50 text-navy-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-3 font-semibold text-navy-900">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-navy-900 text-sm text-white">
              AO
            </span>
            <span className="hidden sm:inline">Airline Analytics Portfolio</span>
          </a>
          <div className="hidden items-center gap-5 text-sm font-medium text-slate-600 lg:flex">
            {navItems.map(([label, href]) => (
              <a key={href} href={href} className="transition hover:text-teal-700">
                {label}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIsDemoModalOpen(true)}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
          >
            Request a Demo
          </button>
        </nav>
      </header>

      <main id="top">
        <section className="section-pad overflow-hidden bg-white">
          <div className="section-inner grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
            <div>
              <p className="eyebrow">Aviation Analytics Portfolio Case Study</p>
              <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-normal text-navy-900 sm:text-5xl lg:text-6xl">
                Airline Demand & Operations Analytics Dashboard
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Using data science, machine learning, and interactive dashboards to explore
                passenger destination demand and operational turn-time performance.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                I build analytics tools that help airlines turn raw search, booking, airport, and
                operations data into useful business and operational insights.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setIsDemoModalOpen(true)}
                  className="rounded-lg bg-navy-900 px-6 py-3 text-center font-semibold text-white transition hover:bg-navy-800"
                >
                  Request a Demo
                </button>
                <a
                  href="#overview"
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-navy-900 transition hover:border-teal-600 hover:text-teal-700"
                >
                  View Case Study
                </a>
              </div>
              <p className="mt-5 max-w-2xl text-sm text-slate-500">
                Portfolio project based on travel analytics and data visualization. No official
                airline branding used.
              </p>
            </div>

            <div className="relative">
              <div className="card overflow-hidden">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
                      Demand and Operations View
                    </span>
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                      portfolio case study
                    </span>
                  </div>
                </div>
                <img
                  src="/project-images/Operational%20Data%20Insights.png"
                  alt="Operational and demand analytics screenshot"
                  className="aspect-[16/9] w-full bg-slate-100 object-cover object-center"
                />
              </div>
              <div className="absolute -bottom-7 left-6 right-6 hidden rounded-lg border border-slate-200 bg-white p-4 shadow-soft sm:block">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold text-navy-900">400K+</p>
                    <p className="text-xs text-slate-500">search records</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-navy-900">3</p>
                    <p className="text-xs text-slate-500">ML tasks</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-navy-900">Ops</p>
                    <p className="text-xs text-slate-500">turn-time analysis</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="overview" className="section-pad">
          <div className="section-inner">
            <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
              <div>
                <p className="eyebrow">Project Overview</p>
                <h2 className="mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">
                  Connecting customer demand with airline operations
                </h2>
              </div>
              <div className="space-y-5 text-base leading-8 text-slate-600">
                <p>
                  This case study combines customer demand analytics and operational performance
                  analysis. It uses large-scale travel search behavior to understand where
                  customers may want to travel next, while also exploring airport and aircraft
                  turn-time performance to identify operational factors associated with longer
                  turns or late departures.
                </p>
                <p>
                  The workflow includes destination prediction, travel search behavior analysis,
                  airport turn-time analysis, model evaluation, and dashboard-based communication.
                  The goal is not to present a production system, but to demonstrate practical data
                  science, machine learning, data management, and visual reporting skills that map
                  to airline business problems.
                </p>
              </div>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {metrics.map(([value, label, description]) => (
                <article key={label} className="card p-6 transition hover:-translate-y-1">
                  <div className="mb-5 h-1.5 w-12 rounded-full bg-teal-500" />
                  <p className="text-3xl font-bold text-navy-900">{value}</p>
                  <h3 className="mt-2 font-semibold text-navy-900">{label}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="visuals" className="section-pad bg-white">
          <div className="section-inner">
            <div className="max-w-3xl">
              <p className="eyebrow">Case Study Visuals</p>
              <h2 className="mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">
                Supporting visuals from the project
              </h2>
              <p className="mt-4 text-slate-600">
                These screenshots support the business story: destination prediction, operational
                turn-time analysis, model comparison, and stakeholder-ready reporting.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {projectImages.map((image) => (
                <article key={image.src} className="card group overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setActiveImage(image)}
                    className="block w-full bg-slate-100 text-left"
                    aria-label={`View larger image for ${image.title}`}
                  >
                    <img
                      src={image.src}
                      alt={`${image.title} screenshot`}
                      className="aspect-[16/10] w-full object-cover object-top transition duration-300 group-hover:scale-[1.025]"
                    />
                  </button>
                  <div className="p-5">
                    <h3 className="font-semibold text-navy-900">{image.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{image.caption}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="dashboard" className="section-pad">
          <div className="section-inner">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <p className="eyebrow">Interactive Decision-Support Dashboard</p>
                <h2 className="mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">
                  Explore demand, routes, and operational factors
                </h2>
                <p className="mt-4 text-slate-600">
                  This dashboard uses sample/demo data inspired by the project structure. It shows
                  how airline teams could explore search demand over time, destination region
                  demand, top destination patterns, origin trends, station type performance,
                  operational factors, model results, and final insights.
                </p>
              </div>
              <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800">
                Sample/demo data
              </div>
            </div>

            <div className="mt-8 grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-soft md:grid-cols-4">
              <Filter label="Month" value={selectedMonth} onChange={setSelectedMonth} options={["All months", ...months]} />
              <Filter label="Origin airport" value={selectedOrigin} onChange={setSelectedOrigin} options={origins} />
              <Filter label="Destination region" value={selectedRegion} onChange={setSelectedRegion} options={regions} />
              <Filter label="Metric" value={selectedMetric} onChange={setSelectedMetric} options={metricsForDashboard} />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-5">
              <article className="card p-5 lg:col-span-3">
                <h3 className="font-semibold text-navy-900">Search demand over time</h3>
                <p className="text-sm text-slate-500">
                  {selectedMetric} by month for selected origin and destination grouping.
                </p>
                <div className="mt-5 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboardData.lineData} margin={{ top: 10, right: 18, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" tickFormatter={(value) => `${formatNumber(value)}${metricSuffix}`} width={72} />
                      <Tooltip formatter={(value) => [`${formatNumber(value)}${metricSuffix}`, selectedMetric]} />
                      <Line type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="card p-5 lg:col-span-2">
                <h3 className="font-semibold text-navy-900">Destination region demand</h3>
                <p className="text-sm text-slate-500">
                  Compare regional demand patterns for planning and targeting.
                </p>
                <div className="mt-5 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.regionData} layout="vertical" margin={{ top: 5, right: 22, left: 18, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" stroke="#64748b" tickFormatter={(value) => `${formatNumber(value)}${metricSuffix}`} />
                      <YAxis dataKey="region" type="category" stroke="#64748b" width={92} />
                      <Tooltip formatter={(value) => [`${formatNumber(value)}${metricSuffix}`, selectedMetric]} />
                      <Bar dataKey="value" fill="#0b2545" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <article className="card p-5">
                <h3 className="font-semibold text-navy-900">Turn-time by station type</h3>
                <p className="text-sm text-slate-500">
                  Sample operational view for spotting station categories with longer turns.
                </p>
                <div className="mt-5 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.stationData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="station" stroke="#64748b" />
                      <YAxis stroke="#64748b" tickFormatter={(value) => `${value}m`} width={48} />
                      <Tooltip formatter={(value, name) => [`${value}${name === "turnTime" ? " min" : "%"}`, name === "turnTime" ? "Avg turn time" : "Late departures"]} />
                      <Bar dataKey="turnTime" fill="#0d9488" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="card p-5">
                <h3 className="font-semibold text-navy-900">Operational factor patterns</h3>
                <p className="text-sm text-slate-500">
                  Demo delay-code style view for identifying possible contributors to long turns.
                </p>
                <div className="mt-5 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.factorData} layout="vertical" margin={{ top: 5, right: 22, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" stroke="#64748b" tickFormatter={(value) => `${value}m`} />
                      <YAxis dataKey="factor" type="category" stroke="#64748b" width={86} />
                      <Tooltip formatter={(value) => [`${value} minutes`, "Avg added time"]} />
                      <Bar dataKey="minutes" fill="#16456f" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>
            </div>

            <article className="card mt-6 overflow-hidden">
              <div className="border-b border-slate-200 px-5 py-4">
                <h3 className="font-semibold text-navy-900">Top destination patterns</h3>
                <p className="text-sm text-slate-500">
                  Sample route table for comparing high-interest origin and destination trends.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Route/category</th>
                      <th className="px-5 py-3">Region</th>
                      <th className="px-5 py-3">Searches</th>
                      <th className="px-5 py-3">Bookings</th>
                      <th className="px-5 py-3">Conversion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {dashboardData.routeData.map((row) => (
                      <tr key={row.route} className="hover:bg-slate-50">
                        <td className="px-5 py-4 font-medium text-navy-900">{row.route}</td>
                        <td className="px-5 py-4 text-slate-600">{row.region}</td>
                        <td className="px-5 py-4 text-slate-600">{formatNumber(row.searches)}</td>
                        <td className="px-5 py-4 text-slate-600">{formatNumber(row.bookings)}</td>
                        <td className="px-5 py-4 text-slate-600">{row.conversion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </div>
        </section>

        <section className="section-pad bg-white">
          <div className="section-inner">
            <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
              <div>
                <p className="eyebrow">Data Management</p>
                <h2 className="mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">
                  Preparing airline data for modeling and decision support
                </h2>
                <p className="mt-4 text-slate-600">
                  The data workflow is a major part of the case study. The project required
                  organizing large datasets, resolving incomplete records, creating useful
                  mappings, and shaping data into model-ready and dashboard-ready formats.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {dataSteps.map(([step, description], index) => (
                  <div key={step} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                    <span className="text-sm font-bold text-teal-700">0{index + 1}</span>
                    <h3 className="mt-2 font-semibold text-navy-900">{step}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                  </div>
                ))}
              </div>
            </div>

            <article className="card mt-10 overflow-hidden">
              <div className="border-b border-slate-200 px-5 py-4">
                <h3 className="font-semibold text-navy-900">Example Data Fields</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Representative fields used to connect customer demand analytics with operational analysis.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Field</th>
                      <th className="px-5 py-3">Business meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {fieldRows.map(([field, description]) => (
                      <tr key={field}>
                        <td className="px-5 py-4 font-mono text-sm text-navy-900">{field}</td>
                        <td className="px-5 py-4 text-slate-600">{description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </div>
        </section>

        <section id="operations" className="section-pad">
          <div className="section-inner grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="eyebrow">Operational Turn-Time Analysis</p>
              <h2 className="mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">
                Using data to explore where operational improvements may be possible
              </h2>
              <p className="mt-5 leading-8 text-slate-600">
                Turn-time performance can be affected by airport type, seasonality, delay codes,
                boarding, sanitation, passenger flow, crew coordination, weather, baggage handling,
                and local station conditions. This part of the project frames operations data as a
                decision-support problem: identify patterns worth investigating, then communicate
                them clearly to teams that can act on them.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Compare turn times by station type and airport category.",
                "Explore seasonal or monthly changes in late-departure risk.",
                "Review delay-code patterns linked to longer turn events.",
                "Translate operational metrics into dashboard summaries."
              ].map((item) => (
                <div key={item} className="card p-5">
                  <div className="mb-4 h-1.5 w-10 rounded-full bg-teal-500" />
                  <p className="leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="results" className="section-pad bg-white">
          <div className="section-inner">
            <div className="max-w-3xl">
              <p className="eyebrow">Modeling And Results</p>
              <h2 className="mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">
                Honest model evaluation for travel-demand prediction
              </h2>
              <p className="mt-4 text-slate-600">
                The project compared baseline models, Random Forest, LightGBM, XGBoost, tuned
                models, and fallback logic. The specific airport prediction task was harder because
                it involved many possible destination classes and sparser examples per class.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {challenges.map((challenge) => (
                <article key={challenge.title} className="card p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                    {challenge.title}
                  </p>
                  <h3 className="mt-3 text-xl font-bold text-navy-900">{challenge.subtitle}</h3>
                  <p className="mt-5 text-5xl font-bold text-navy-900">{challenge.accuracy}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">final accuracy</p>
                  <p className="mt-5 text-sm leading-6 text-slate-600">{challenge.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="section-inner">
            <div className="max-w-3xl">
              <p className="eyebrow">Insights</p>
              <h2 className="mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">
                What airline teams can take from this case study
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
              {insights.map((insight, index) => (
                <article key={insight} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal-50 font-bold text-teal-700">
                    {index + 1}
                  </span>
                  <p className="mt-5 leading-7 text-slate-700">{insight}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="section-pad bg-white">
          <div className="section-inner">
            <div className="rounded-lg border border-slate-200 bg-navy-900 p-8 text-white shadow-soft sm:p-10 lg:p-12">
              <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-300">
                    About Me
                  </p>
                  <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-100">
                    I am a Master's student in Computer Science with experience in machine
                    learning, data science, software development, and research-focused analytics.
                    My work focuses on turning complex datasets into practical insights through
                    predictive modeling, data visualization, and clear communication. I am
                    especially interested in analytics projects that connect customer behavior,
                    operational performance, and business decision-making.
                  </p>
                </div>
                <div id="contact" className="rounded-lg border border-white/15 bg-white/10 p-6">
                  <h2 className="text-2xl font-bold text-white">Interested in airline analytics?</h2>
                  <p className="mt-3 leading-7 text-slate-200">
                    I would be happy to connect about data science, dashboard development,
                    operational intelligence, or aviation analytics roles.
                  </p>
                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => setIsDemoModalOpen(true)}
                      className="rounded-lg border border-white/30 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
                    >
                      Request a Demo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-5 py-8 text-sm text-slate-600 sm:px-6 lg:px-8">
       
      </footer>

      {activeImage && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy-900/80 p-4" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-soft">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="font-semibold text-navy-900">{activeImage.title}</h3>
                <p className="text-sm text-slate-500">{activeImage.caption}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveImage(null)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>
            <div className="max-h-[72vh] overflow-auto bg-slate-100 p-3">
              <img
                src={activeImage.src}
                alt={`${activeImage.title} enlarged screenshot`}
                className="mx-auto max-h-[68vh] w-auto max-w-full rounded bg-white object-contain"
              />
            </div>
          </div>
        </div>
      )}

      <RequestDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSuccess={() => setIsSuccessPopupOpen(true)}
      />

      {isSuccessPopupOpen && (
        <SuccessPopup onClose={() => setIsSuccessPopupOpen(false)} />
      )}
    </div>
  );
}

function SuccessPopup({ onClose }) {
  return (
    <div
      className="modal-overlay fixed inset-0 z-50 grid place-items-center bg-navy-900/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-popup-title"
      onClick={onClose}
    >
      <div
        className="modal-panel w-full max-w-md rounded-lg bg-white p-6 text-center shadow-soft"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-teal-50 text-2xl font-bold text-teal-700">
          ✓
        </div>
        <h2 id="success-popup-title" className="mt-5 text-2xl font-bold text-navy-900">
          Demo Request Submitted
        </h2>
        <p className="mt-3 leading-7 text-slate-600">
          Thank you - your demo request has been submitted. I'll follow up soon.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function Filter({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-navy-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default App;
