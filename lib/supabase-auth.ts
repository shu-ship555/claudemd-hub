export function getSupabaseAuthHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  }
}

export interface SupabaseUser {
  id: string
  email?: string
  [key: string]: unknown
}

export async function fetchSupabaseUser(token: string): Promise<SupabaseUser | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`,
      { headers: getSupabaseAuthHeaders(token) }
    )
    if (!response.ok) return null
    return (await response.json()) as SupabaseUser
  } catch {
    return null
  }
}
