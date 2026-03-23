'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { Search, Star } from 'lucide-react'
import { educators } from './site-data'

export default function SearchableEducators() {
  const [search, setSearch] = useState('')
  const [curriculum, setCurriculum] = useState('All Curricula')
  const [city, setCity] = useState('All Cities')

  const filtered = useMemo(() => {
    return educators.filter((e) => {
      const q = search.toLowerCase()
      const matchesSearch =
        e.name.toLowerCase().includes(q) ||
        e.subject.toLowerCase().includes(q) ||
        e.title.toLowerCase().includes(q)
      const matchesCurriculum = curriculum === 'All Curricula' || e.curriculum === curriculum
      const matchesCity = city === 'All Cities' || e.city === city
      return matchesSearch && matchesCurriculum && matchesCity
    })
  }, [search, curriculum, city])

  return (
    <div className="mt-10">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative md:col-span-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-11"
            placeholder="Search by name, subject, or specialty"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="input" value={curriculum} onChange={(e) => setCurriculum(e.target.value)}>
          <option>All Curricula</option>
          <option>Cambridge</option>
          <option>Edexcel</option>
          <option>A-Level</option>
          <option>IB</option>
        </select>
        <select className="input" value={city} onChange={(e) => setCity(e.target.value)}>
          <option>All Cities</option>
          <option>Nairobi</option>
          <option>Mombasa</option>
          <option>Kisumu</option>
          <option>Nakuru</option>
          <option>Thika</option>
        </select>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((educator) => (
          <div key={educator.name} className="card overflow-hidden">
            <div className="relative aspect-[4/3]">
              <Image src={educator.image} alt={educator.name} fill className="object-cover" />
            </div>
            <div className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-serif">{educator.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">{educator.title}</p>
                </div>
                <span className="rounded-full bg-forest px-3 py-1 text-xs font-medium text-white">Verified</span>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-slate-700">
                <span className="rounded-full border border-gold/30 px-3 py-1">{educator.curriculum}</span>
                <span className="rounded-full border border-gold/30 px-3 py-1">{educator.subject}</span>
                <span className="rounded-full border border-gold/30 px-3 py-1">{educator.city}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <div className="text-slate-500">Rating</div>
                  <div className="mt-1 flex items-center gap-1 font-semibold text-slate-800"><Star className="h-4 w-4 fill-gold text-gold" />{educator.rating}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <div className="text-slate-500">Rate</div>
                  <div className="mt-1 font-semibold text-slate-800">{educator.rate}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <div className="text-slate-500">Experience</div>
                  <div className="mt-1 font-semibold text-slate-800">{educator.experience}</div>
                </div>
              </div>
              <button className="btn-primary w-full">View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
