import { create } from 'zustand'

export type VerificationResult = {
  email: string
  status: string
  score: number
  deliverability: string
  mx_valid: boolean
  is_disposable: boolean
  is_role_account: boolean
}

interface BulkState {
  file: File | null
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error'
  taskId: string | null
  progress: number
  total: number
  processed: number
  valid: number
  invalid: number
  risky: number
  results: VerificationResult[]
  error: string | null

  // Actions
  setFile: (file: File | null) => void
  uploadFile: () => Promise<void>
  pollStatus: () => void
  reset: () => void
  exportCSV: (filter?: 'all' | 'valid' | 'invalid' | 'risky') => void
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const useBulkStore = create<BulkState>((set, get) => ({
  file: null,
  status: 'idle',
  taskId: null,
  progress: 0,
  total: 0,
  processed: 0,
  valid: 0,
  invalid: 0,
  risky: 0,
  results: [],
  error: null,

  setFile: (file) => set({ file, status: 'idle', error: null, progress: 0, results: [] }),

  uploadFile: async () => {
    const { file } = get()
    if (!file) return

    set({ status: 'uploading', error: null })

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_URL}/v1/bulk/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.detail || 'Upload failed')
      }

      const data = await response.json()
      set({ status: 'processing', taskId: data.task_id })

      // Start polling
      get().pollStatus()

    } catch (err: any) {
      set({ status: 'error', error: err.message })
    }
  },

  pollStatus: async () => {
    const { taskId, status } = get()
    if (!taskId || status === 'complete' || status === 'error') return

    try {
      const response = await fetch(`${API_URL}/v1/bulk/status/${taskId}`)
      if (!response.ok) throw new Error('Failed to fetch status')

      const data = await response.json()
      
      set({
        status: data.status,
        progress: data.progress,
        total: data.total,
        processed: data.processed,
        valid: data.valid,
        invalid: data.invalid,
        risky: data.risky,
        results: data.results || [],
      })

      // Continue polling if still processing
      if (data.status === 'processing') {
        setTimeout(() => {
          get().pollStatus()
        }, 2000)
      }
    } catch (err: any) {
      set({ status: 'error', error: err.message })
    }
  },

  reset: () => set({
    file: null,
    status: 'idle',
    taskId: null,
    progress: 0,
    total: 0,
    processed: 0,
    valid: 0,
    invalid: 0,
    risky: 0,
    results: [],
    error: null,
  }),

  exportCSV: (filter = 'all') => {
    const { results, taskId } = get()
    if (!results.length) return

    let dataToExport = results
    if (filter === 'valid') dataToExport = results.filter(r => r.status === 'valid')
    if (filter === 'invalid') dataToExport = results.filter(r => r.status === 'invalid' || r.status === 'disposable')
    if (filter === 'risky') dataToExport = results.filter(r => r.status === 'risky')

    const header = 'email,status,score,deliverability,mx_valid,is_disposable,is_role_account'
    const rows = dataToExport.map(r => 
      `${r.email},${r.status},${r.score},"${r.deliverability}",${r.mx_valid},${r.is_disposable},${r.is_role_account}`
    )
    
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cleanbounce_${filter}_results.csv`
    a.click()
    URL.revokeObjectURL(url)
  }
}))
