export type VerificationStatus = 'valid' | 'invalid' | 'risky' | 'disposable' | 'unknown'
export type UserRole = 'owner' | 'admin' | 'member' | 'viewer'
export type Plan = 'free' | 'starter' | 'pro' | 'scale' | 'enterprise'

export interface VerifyResult {
  email: string
  status: VerificationStatus
  score: number
  mx_valid: boolean
  is_disposable: boolean
  is_role_account: boolean
  smtp_response: string
  checked_at: string
}

export interface BulkJob {
  id: string
  status: 'queued' | 'processing' | 'complete' | 'failed'
  total_count: number
  processed_count: number
  credits_used: number
  created_at: string
  completed_at?: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: { credits_used?: number; credits_remaining?: number }
  error?: string
}
