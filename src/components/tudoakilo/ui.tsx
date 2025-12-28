'use client'

import { Star } from 'lucide-react'

export const currency = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function MiniInfo({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-[#faf7f3] border border-black/5 grid place-items-center text-[#6b4a32]">
        {icon}
      </div>
      <div>
        <div className="text-[13px] font-semibold text-black/80">{title}</div>
        <div className="text-[12px] text-black/60">{subtitle}</div>
      </div>
    </div>
  )
}

export function IconCard({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 text-center">
      <div className="mx-auto w-10 h-10 rounded-xl bg-[#faf7f3] border border-black/5 grid place-items-center text-[#6b4a32]">
        {icon}
      </div>
      <div className="mt-3 text-[11px] font-semibold text-black/80">{title}</div>
      <div className="mt-1 text-[11px] text-black/60">{subtitle}</div>
    </div>
  )
}

export function Bullet({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-[#faf7f3] p-4">
      <div className="text-[13px] font-semibold text-[#6b4a32]">{title}</div>
      <div className="mt-1 text-[13px] text-black/70">{text}</div>
    </div>
  )
}

export function Spec({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <li className="text-[13px] text-[#b08c6a] leading-relaxed">
      <span className="font-bold text-[#b08c6a]">{label}:</span>{' '}
      <span>{value}</span>
    </li>
  )
}


export function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-2xl border border-black/10 bg-[#faf7f3] p-4">
      <summary className="cursor-pointer list-none text-[13px] font-semibold text-black/80 flex items-center justify-between">
        {q}
        <span className="text-black/50 group-open:rotate-180 transition">⌄</span>
      </summary>
      <div className="mt-2 text-[13px] text-black/70 leading-relaxed">{a}</div>
    </details>
  )
}

export function RatingBar({
  label,
  value,
  total,
}: {
  label: string
  value: number
  total: number
}) {
  const pct = Math.round((value / total) * 100)
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="w-8 text-[12px] text-black/60 flex items-center gap-1">
        <span>{label}</span>
        <Star className="w-3 h-3" fill="#f5b301" stroke="#f5b301" />
      </div>
      <div className="flex-1 h-2 rounded-full bg-black/10 overflow-hidden">
        <div className="h-full bg-[#f5b301]" style={{ width: `${pct}%` }} />
      </div>
      <div className="w-10 text-right text-[12px] text-black/60">{value}</div>
    </div>
  )
}
