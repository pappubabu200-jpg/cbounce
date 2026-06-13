'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBulkStore, VerificationResult } from '@/store/bulkStore'

// ─── Shared Badges & Icons ──────────────────────────────────────────────────
const STATUS_STYLES: Record<string, { bg: string; text: string; icon: string }> = {
  valid: { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-500', icon: '✅' },
  invalid: { bg: 'bg-rose-500/10 border-rose-500/20', text: 'text-rose-500', icon: '❌' },
  risky: { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-500', icon: '⚠️' },
  disposable: { bg: 'bg-rose-500/10 border-rose-500/20', text: 'text-rose-500', icon: '🚫' },
  unknown: { bg: 'bg-slate-500/10 border-slate-500/20', text: 'text-slate-400', icon: '❓' },
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.unknown
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${s.bg} ${s.text} capitalize tracking-wide`}>
      <span>{s.icon}</span> {status}
    </span>
  )
}

// ─── Main Page Component ────────────────────────────────────────────────────
export default function BulkVerificationPage() {
  const {
    file,
    status,
    progress,
    total,
    processed,
    valid,
    invalid,
    risky,
    results,
    error,
    setFile,
    uploadFile,
    reset,
    exportCSV
  } = useBulkStore()

  const [dragOver, setDragOver] = useState(false)
  const [filter, setFilter] = useState<'all' | 'valid' | 'invalid' | 'risky'>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ─── Derived Metrics ───
  const bounceRate = total > 0 ? Math.round(((invalid + risky) / total) * 100) : 0
  const deliverabilityScore = 100 - bounceRate

  // ─── Handlers ───
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f && (f.name.endsWith('.csv') || f.name.endsWith('.xlsx') || f.type === 'text/csv')) {
      setFile(f)
    } else {
      alert('Only CSV or XLSX files are supported.')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  // ─── Render Results Filtered ───
  const filteredResults = results.filter(r => {
    if (filter === 'all') return true
    if (filter === 'valid') return r.status === 'valid'
    if (filter === 'invalid') return r.status === 'invalid' || r.status === 'disposable'
    if (filter === 'risky') return r.status === 'risky'
    return true
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </span>
          Bulk List Verification
        </h1>
        <p className="mt-3 text-slate-400 text-lg">
          Upload large CSV or XLSX files to clean your lists before sending.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* ── Idle / Upload State ── */}
        {(status === 'idle' || status === 'error') && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-8"
          >
            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium text-sm">{error}</span>
              </div>
            )}

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer p-12 text-center flex flex-col items-center justify-center min-h-[300px]
                ${dragOver ? 'border-indigo-500 bg-indigo-500/5' : file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'}`}
            >
              <input ref={fileInputRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={handleFileChange} />
              
              {file ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{file.name}</h3>
                  <p className="text-slate-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mb-4 border border-slate-700 shadow-xl">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Drag & Drop your file</h3>
                  <p className="text-slate-400 mb-6 text-sm">Supports CSV or XLSX up to 100,000 rows.</p>
                  <button className="px-6 py-2.5 rounded-lg bg-slate-800 text-slate-300 font-semibold border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors text-sm">
                    Browse Files
                  </button>
                </div>
              )}
            </div>

            {file && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex justify-end gap-4">
                <button onClick={reset} className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 hover:text-white transition-all text-sm">
                  Cancel
                </button>
                <button onClick={uploadFile} className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] text-sm flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Start Verification
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── Processing State ── */}
        {(status === 'uploading' || status === 'processing') && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-3">
                  <svg className="animate-spin w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {status === 'uploading' ? 'Uploading File...' : 'Verifying Emails...'}
                </h3>
                <p className="text-slate-400 text-sm">
                  {status === 'processing' ? `Verified ${processed.toLocaleString()} / ${total.toLocaleString()} emails` : 'Please wait while we upload your file.'}
                </p>
              </div>
              <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 tracking-tighter">
                {progress}%
              </div>
            </div>

            <div className="h-4 bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-700/50">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 transition-all duration-500 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-30" />
              </div>
            </div>

            {/* Live Stats Preview */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="text-sm text-slate-400 font-medium mb-1">Valid</div>
                <div className="text-2xl font-bold text-emerald-400">{valid.toLocaleString()}</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="text-sm text-slate-400 font-medium mb-1">Invalid</div>
                <div className="text-2xl font-bold text-rose-400">{invalid.toLocaleString()}</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="text-sm text-slate-400 font-medium mb-1">Risky</div>
                <div className="text-2xl font-bold text-amber-400">{risky.toLocaleString()}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Complete State (Results) ── */}
        {status === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Analytics Dashboard */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                <div className="text-sm font-semibold text-slate-400 mb-2">Total Emails</div>
                <div className="text-3xl font-extrabold text-white">{total.toLocaleString()}</div>
                <div className="absolute -right-4 -bottom-4 text-6xl opacity-5">📧</div>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="text-sm font-semibold text-emerald-500 mb-2">Valid (Safe)</div>
                <div className="text-3xl font-extrabold text-emerald-400">{valid.toLocaleString()}</div>
                <div className="text-xs text-emerald-500/70 font-medium mt-1">{((valid/total)*100).toFixed(1)}% of list</div>
                <div className="absolute -right-4 -bottom-4 text-6xl opacity-10">✅</div>
              </div>
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="text-sm font-semibold text-rose-500 mb-2">Invalid (Remove)</div>
                <div className="text-3xl font-extrabold text-rose-400">{invalid.toLocaleString()}</div>
                <div className="text-xs text-rose-500/70 font-medium mt-1">{((invalid/total)*100).toFixed(1)}% of list</div>
                <div className="absolute -right-4 -bottom-4 text-6xl opacity-10">❌</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                <div className="text-sm font-semibold text-slate-400 mb-2">Deliverability Score</div>
                <div className={`text-3xl font-extrabold ${deliverabilityScore >= 90 ? 'text-emerald-400' : deliverabilityScore >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {deliverabilityScore}%
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">Bounce Forecaster™</div>
                <div className="absolute -right-4 -bottom-4 text-6xl opacity-5">📈</div>
              </div>
            </div>

            {/* Results Table & Toolbar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
              
              {/* Toolbar */}
              <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/50">
                <div className="flex bg-slate-800 p-1 rounded-lg">
                  {(['all', 'valid', 'invalid', 'risky'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${filter === f ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button onClick={() => exportCSV(filter)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-sm font-bold hover:bg-indigo-500/20 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export {filter === 'all' ? 'All' : filter}
                  </button>
                  <button onClick={reset} className="flex items-center justify-center p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors" title="Verify New List">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-900/80 sticky top-0 backdrop-blur-md border-b border-slate-800 z-10">
                    <tr>
                      <th className="px-6 py-4 font-bold tracking-wider">Email Address</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Score</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Attributes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredResults.slice(0, 500).map((r, i) => (
                      <tr key={i} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="px-6 py-4 font-medium text-white truncate max-w-[250px]">
                          {r.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={r.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${r.score >= 80 ? 'bg-emerald-500' : r.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                                style={{ width: `${r.score}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold font-mono text-slate-400">{r.score}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 flex gap-2">
                          {r.mx_valid && <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">MX</span>}
                          {r.is_disposable && <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">Disposable</span>}
                          {r.is_role_account && <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Role</span>}
                          {!r.mx_valid && !r.is_disposable && !r.is_role_account && <span>—</span>}
                        </td>
                      </tr>
                    ))}
                    {filteredResults.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                          No results match the current filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {filteredResults.length > 500 && (
                <div className="p-3 text-center text-xs font-medium text-slate-500 bg-slate-900 border-t border-slate-800">
                  Showing first 500 rows. Export to view all {filteredResults.length.toLocaleString()} results.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
