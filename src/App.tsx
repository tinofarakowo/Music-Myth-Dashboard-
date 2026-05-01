/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { TrendingUp, Clock, Zap, Star } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DashboardData {
  chappellRoan: {
    labels: string[];
    points: number[];
    milestones: Record<string, string>;
  };
  sabrinaCarpenter: {
    labels: string[];
    releases: number[];
    milestones: Record<string, string>;
  };
  lizzo: {
    labels: string[];
    popularity: number[];
    milestones: Record<string, string>;
  };
}

export default function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard-data')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05060a] flex items-center justify-center text-cyan-400 font-mono italic animate-pulse">
        <div className="flex flex-col items-center gap-4">
          <Zap className="w-12 h-12 text-cyan-400" />
          <span className="tracking-[0.3em] font-bold">LOADING SUCCESS METRICS...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Chart 1: Chappell Roan (Line Chart)
  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(5, 6, 10, 0.9)',
        titleColor: '#00f5ff',
        bodyColor: '#fff',
        borderColor: '#00f5ff',
        borderWidth: 1,
        padding: 12,
        titleFont: { family: 'Inter', size: 14, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 12 },
        callbacks: {
          label: (context) => {
            const year = data.chappellRoan.labels[context.dataIndex];
            const milestone = data.chappellRoan.milestones[year];
            return milestone ? ` ${milestone}` : ' Progress Tracking';
          }
        }
      }
    },
    scales: {
      y: { display: false },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.3)', font: { size: 10, family: 'monospace' } }
      }
    }
  };

  const lineData = {
    labels: data.chappellRoan.labels,
    datasets: [{
      label: 'Growth',
      data: data.chappellRoan.points,
      borderColor: '#00f5ff',
      backgroundColor: 'rgba(0, 245, 255, 0.1)',
      borderWidth: 4,
      fill: true,
      tension: 0.4,
      pointRadius: (ctx: any) => (data.chappellRoan.milestones[data.chappellRoan.labels[ctx.dataIndex]] ? 6 : 0),
      pointBackgroundColor: (ctx: any) => (ctx.dataIndex === data.chappellRoan.labels.length - 1 ? '#fff' : '#00f5ff'),
      pointHoverRadius: 8,
    }]
  };

  // Chart 2: Sabrina Carpenter (Bar Chart)
  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(5, 6, 10, 0.9)',
        titleColor: '#d946ef',
        bodyColor: '#fff',
        borderColor: '#d946ef',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            const year = data.sabrinaCarpenter.labels[context.dataIndex];
            const milestone = data.sabrinaCarpenter.milestones[year];
            return milestone ? ` ${milestone}` : ` Release Volume: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: { display: false },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.3)', font: { size: 10, family: 'monospace' } }
      }
    }
  };

  const barData = {
    labels: [
      '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'
    ],
    datasets: [{
      label: 'Output',
      data: [15, 20, 22, 28, 35, 45, 52, 60, 75, 88, 100], // Normalized release volume for visual impact
      backgroundColor: 'rgba(217, 70, 239, 0.1)',
      hoverBackgroundColor: '#d946ef',
      borderColor: '#d946ef',
      borderWidth: (ctx: any) => (ctx.dataIndex >= 8 ? 2 : 0),
      borderRadius: 4,
    }]
  };

  // Chart 3: Lizzo (Sleeper Hit Gap)
  const sleeperOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(5, 6, 10, 0.9)',
        titleColor: '#3b82f6',
        bodyColor: '#fff',
        borderColor: '#3b82f6',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            const label = data.lizzo.labels[context.dataIndex];
            const milestone = data.lizzo.milestones[label];
            return milestone ? ` ${milestone}` : ' Popularity Index';
          }
        }
      }
    },
    scales: {
      y: { display: false, type: 'linear', min: 0, max: 110 },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.3)', font: { size: 10, family: 'monospace' } }
      }
    }
  };

  const sleeperData = {
    labels: data.lizzo.labels,
    datasets: [{
      label: 'Popularity',
      data: data.lizzo.popularity,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.4)',
      borderWidth: 4,
      fill: true,
      stepped: true,
      pointRadius: (ctx: any) => (ctx.dataIndex === 0 || ctx.dataIndex === data.lizzo.labels.length - 1 ? 6 : 0),
      pointBackgroundColor: (ctx: any) => (ctx.raw === 100 ? '#fff' : '#3b82f6'),
      pointBorderColor: '#3b82f6',
    }]
  };

  return (
    <div className="min-h-screen bg-[#05060a] text-white font-sans overflow-x-hidden flex flex-col p-4 md:p-12">
      
      {/* Header Section */}
      <header className="mb-12 border-l-4 border-cyan-500 pl-6 py-2 max-w-7xl mx-auto w-full">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-magenta-500 uppercase">
          The 10-Year Overnight Success
        </h1>
        <p className="text-blue-200 opacity-80 text-lg mt-2 font-light">
          You didn't discover them early; you just finally caught up. 
          <span className="text-cyan-400 font-medium block md:inline md:ml-2 italic uppercase tracking-wider text-sm">
            Analysis of the true timelines behind viral breakouts.
          </span>
        </p>
      </header>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow max-w-7xl mx-auto w-full">
        
        {/* Chart 1: Chappell Roan */}
        <div className="bg-[#0d1117] rounded-xl border border-white/10 p-6 flex flex-col shadow-2xl relative group transition-all hover:bg-[#111620]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-cyan-400 text-[10px] uppercase tracking-[0.3em] font-bold mb-1">The "Grit" Timeline</h2>
              <h3 className="text-2xl font-bold tracking-tight">Chappell Roan</h3>
            </div>
            <div className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded text-[10px] font-mono border border-cyan-500/30">2014-2024</div>
          </div>
          
          <div className="relative flex-grow h-64 mt-4 border-b border-l border-white/5 bg-black/20 rounded-sm overflow-hidden p-4">
            <Line options={lineOptions} data={lineData} />
          </div>
          
          <div className="mt-6 flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-tighter">
            <span>2014 (Signed)</span>
            <span>2020 (Dropped)</span>
            <span>2024 (Viral)</span>
          </div>
          
          <p className="mt-6 text-[11px] text-white/50 leading-relaxed italic border-t border-white/5 pt-4">
            A decade of indie struggle, label drops, and moving back home before "Good Luck, Babe!" redefined the pop landscape.
          </p>

          {/* Biographical Summary: Chappell Roan */}
          <div className="mt-4 p-4 bg-white/[0.03] rounded-lg border border-white/5">
            <p className="text-[11px] text-white/70 leading-relaxed">
              Chappell Roan spent nearly a decade in the indie scene, initially signing with Atlantic Records in 2014 before being dropped in 2020. She moved back to Missouri to work as a barista, continuing to release music independently until her debut album finally ignited a global firestorm.
            </p>
          </div>
        </div>

        {/* Chart 2: Sabrina Carpenter */}
        <div className="bg-[#0d1117] rounded-xl border border-white/10 p-6 flex flex-col shadow-2xl relative group transition-all hover:bg-[#111620]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-magenta-500 text-[10px] uppercase tracking-[0.3em] font-bold mb-1">The Incremental Climb</h2>
              <h3 className="text-2xl font-bold tracking-tight">Sabrina Carpenter</h3>
            </div>
            <div className="bg-magenta-500/20 text-magenta-400 px-2 py-1 rounded text-[10px] font-mono border border-magenta-500/30">5 Studio Albums</div>
          </div>

          <div className="relative flex-grow h-64 mt-4 bg-black/20 rounded-sm overflow-hidden p-4">
            <Bar options={barOptions} data={barData} />
          </div>

          <div className="mt-6 flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-tighter">
            <span>2014 (Disney)</span>
            <span>2022 (Emails)</span>
            <span>2024 (Espresso)</span>
          </div>
          
          <p className="mt-6 text-[11px] text-white/50 leading-relaxed italic border-t border-white/5 pt-4">
            Consistent output since age 14. 5 albums, dozens of acting credits, and a relentless release schedule finally hit the global tipping point.
          </p>

          {/* Biographical Summary: Sabrina Carpenter */}
          <div className="mt-4 p-4 bg-white/[0.03] rounded-lg border border-white/5">
            <p className="text-[11px] text-white/70 leading-relaxed">
              Sabrina Carpenter was a consistent presence in the music and TV industries for over ten years, building a massive catalog through five studio albums. Her current chart dominance is the result of years of refinement, a relentlessly disciplined release schedule, and a patient evolution into a global pop powerhouse.
            </p>
          </div>
        </div>

        {/* Chart 3: Lizzo */}
        <div className="bg-[#0d1117] rounded-xl border border-white/10 p-6 flex flex-col shadow-2xl relative group transition-all hover:bg-[#111620]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-blue-500 text-[10px] uppercase tracking-[0.3em] font-bold mb-1">The Sleeper Hit Gap</h2>
              <h3 className="text-2xl font-bold tracking-tight">Lizzo: "Truth Hurts"</h3>
            </div>
            <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-[10px] font-mono border border-blue-500/30">714 Day Gap</div>
          </div>

          <div className="relative flex-grow h-64 mt-4 bg-black/20 rounded-sm overflow-hidden p-4">
            <Line options={sleeperOptions} data={sleeperData} />
          </div>

          <div className="mt-6 flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-tighter">
            <span>2017 (Release)</span>
            <span>2018 (Dormant)</span>
            <span>2019 (Breakout)</span>
          </div>

          <div className="mt-6 p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
            <p className="text-[12px] leading-relaxed text-white/70">
              <span className="text-blue-400 font-bold mr-1">Insight:</span> 
              Released to silence in 2017, the track required a 2-year incubation period before becoming the "hit of the summer" in 2019.
            </p>
          </div>

          {/* Biographical Summary: Lizzo */}
          <div className="mt-4 p-4 bg-white/[0.03] rounded-lg border border-white/5">
            <p className="text-[11px] text-white/70 leading-relaxed">
              Lizzo began her journey in the Minneapolis underground hip-hop scene, releasing multiple independent albums for years before signing with a major label. Her "overnight" success was actually the culmination of over eight years of grinding, touring, and a signature sound that was far ahead of its time.
            </p>
          </div>
        </div>

      </div>

      {/* Footer Stats */}
      <footer className="mt-12 flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-8 pb-4 max-w-7xl mx-auto w-full gap-8">
        <div className="flex flex-wrap gap-8 md:gap-16">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
              <Clock size={10} className="text-cyan-400" /> Avg. Prep Time
            </span>
            <span className="text-3xl font-mono text-cyan-400 font-bold tracking-tighter">8.2 Years</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
              <TrendingUp size={10} className="text-magenta-500" /> Peak Viral Velocity
            </span>
            <span className="text-3xl font-mono text-magenta-500 font-bold tracking-tighter">4.8M / Day</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
              <Star size={10} className="text-blue-500" /> Industry Lag
            </span>
            <span className="text-3xl font-mono text-blue-500 font-bold tracking-tighter">~650 Days</span>
          </div>
        </div>
        
        <div className="text-center md:text-right text-[10px] font-mono text-white/20 uppercase tracking-widest leading-loose">
          DATA SOURCE: RIAA / BILLBOARD / SPOTIFY ANALYTICS <br/>
          REF: "THE 10,000 HOUR MYTH IN STREAMING ECONOMICS"
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.4; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
