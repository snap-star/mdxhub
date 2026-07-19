import React from 'react'

interface DataPoint {
  label: string
  value: number
}

interface ChartProps {
  type?: 'bar' | 'line' | 'area' | 'pie'
  data: DataPoint[]
  title?: string
  height?: number
  className?: string
  donut?: boolean
}

const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

function c(i: number): string {
  return COLORS[i % COLORS.length]
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}

function deg(r: number): number {
  return (r * Math.PI) / 180
}

export function Chart({ type = 'bar', data, title, height = 300, className = '', donut = false }: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="my-6 rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        No data to display
      </div>
    )
  }

  const max = Math.max(...data.map(d => d.value), 1)
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <figure className={`my-6 rounded-xl border border-border bg-card p-4 sm:p-6 ${className}`}>
      {title && (
        <figcaption className="mb-4 text-center text-sm font-semibold text-foreground">
          {title}
        </figcaption>
      )}
      {type === 'pie' ? <PieChart /> : <CartesianChart />}
    </figure>
  )

  function CartesianChart() {
    const W = 600
    const H = height
    const PT = 20
    const PR = 20
    const PB = 50
    const PL = 50
    const CW = W - PL - PR
    const CH = H - PT - PB
    const step = CW / data.length
    const bw = Math.min(step * 0.7, 48)

    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={title || 'Chart'}>
        {Array.from({ length: 6 }, (_, i) => {
          const y = PT + CH - (i / 5) * CH
          return (
            <g key={i}>
              <line x1={PL} y1={y} x2={PL + CW} y2={y} stroke="currentColor" strokeOpacity={0.1} strokeWidth={1} />
              <text x={PL - 8} y={y + 4} textAnchor="end" fill="var(--muted-foreground)" fontSize={11}>
                {fmt(Math.round((i / 5) * max))}
              </text>
            </g>
          )
        })}
        <line x1={PL} y1={PT + CH} x2={PL + CW} y2={PT + CH} stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} />
        {type === 'bar' && renderBars()}
        {(type === 'line' || type === 'area') && renderLine()}
      </svg>
    )

    function renderBars() {
      return data.map((d, i) => {
        const x = PL + i * step + (step - bw) / 2
        const bh = (d.value / max) * CH
        const y = PT + CH - bh
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={Math.max(bh, 1)} fill={c(i)} rx={3} />
            <text
              x={PL + i * step + step / 2}
              y={PT + CH + 16}
              textAnchor="end"
              transform={`rotate(-30 ${PL + i * step + step / 2},${PT + CH + 16})`}
              fill="var(--muted-foreground)"
              fontSize={10}
            >
              {d.label}
            </text>
            <text x={PL + i * step + step / 2} y={y - 6} textAnchor="middle" fill="var(--muted-foreground)" fontSize={10}>
              {fmt(d.value)}
            </text>
          </g>
        )
      })
    }

    function renderLine() {
      const pts = data.map((d, i) => ({
        x: PL + i * step + step / 2,
        y: PT + CH - (d.value / max) * CH,
      }))
      const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join('')

      return (
        <g>
          {type === 'area' && (
            <path
              d={`${path}L${pts[pts.length - 1].x},${PT + CH}L${pts[0].x},${PT + CH}Z`}
              fill={c(0)}
              fillOpacity={0.15}
            />
          )}
          <path d={path} fill="none" stroke={c(0)} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          {pts.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={4} fill={c(0)} stroke="var(--card)" strokeWidth={2} />
              <text x={p.x} y={p.y - 10} textAnchor="middle" fill="var(--muted-foreground)" fontSize={10}>
                {fmt(data[i].value)}
              </text>
              <text
                x={p.x}
                y={PT + CH + 16}
                textAnchor="end"
                transform={`rotate(-30 ${p.x},${PT + CH + 16})`}
                fill="var(--muted-foreground)"
                fontSize={10}
              >
                {data[i].label}
              </text>
            </g>
          ))}
        </g>
      )
    }
  }

  function PieChart() {
    if (total === 0) {
      return (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No data to display
        </div>
      )
    }

    const size = 280
    const R = donut ? 90 : 110
    const rI = donut ? 50 : 0
    const W = size + 160
    const H = size
    const cx = size / 2
    const cy = size / 2

    let angle = 0
    const slices = data.map((d, i) => {
      const sweep = (d.value / total) * 360
      const s = { ...d, start: angle, end: angle + sweep, color: c(i) }
      angle += sweep
      return s
    })

    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-w-[500px] mx-auto" role="img" aria-label={title || 'Pie chart'}>
        {slices.map((s, i) => {
          if (s.value === 0) return null
          const sa = deg(s.start - 90)
          const ea = deg(s.end - 90)
          const large = s.end - s.start > 180 ? 1 : 0

          const x1 = cx + R * Math.cos(sa)
          const y1 = cy + R * Math.sin(sa)
          const x2 = cx + R * Math.cos(ea)
          const y2 = cy + R * Math.sin(ea)

          let d: string
          if (rI > 0) {
            const ix1 = cx + rI * Math.cos(sa)
            const iy1 = cy + rI * Math.sin(sa)
            const ix2 = cx + rI * Math.cos(ea)
            const iy2 = cy + rI * Math.sin(ea)
            d = `M${x1},${y1}A${R},${R},0,${large},1,${x2},${y2}L${ix2},${iy2}A${rI},${rI},0,${large},0,${ix1},${iy1}Z`
          } else {
            d = `M${cx},${cy}L${x1},${y1}A${R},${R},0,${large},1,${x2},${y2}Z`
          }

          return <path key={i} d={d} fill={s.color} stroke="var(--card)" strokeWidth={2} />
        })}
        {donut && (
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="var(--foreground)" fontSize={14} fontWeight={600}>
            {fmt(total)}
          </text>
        )}
        <g transform={`translate(${size + 10}, 20)`}>
          {slices.map((s, i) => (
            <g key={i} transform={`translate(0, ${i * 24})`}>
              <rect x={0} y={0} width={12} height={12} rx={2} fill={s.color} />
              <text x={20} y={10} fill="var(--muted-foreground)" fontSize={11}>
                {s.label} ({Math.round((s.value / total) * 100)}%)
              </text>
            </g>
          ))}
        </g>
      </svg>
    )
  }
}
