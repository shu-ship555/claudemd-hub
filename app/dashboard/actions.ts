'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export interface ConfigFile {
  id: string
  user_id: string
  name: string
  content: string
  created_at: string
  updated_at: string
}

async function getAccessToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get('sb-access-token')?.value
  if (!token) throw new Error('No access token')
  return token
}

export async function getConfigFiles(): Promise<ConfigFile[]> {
  const accessToken = await getAccessToken()

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/config_files?order=created_at.desc`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
    }
  )

  if (!response.ok) throw new Error('Failed to fetch config files')
  return response.json()
}

export async function createConfigFile(
  name: string,
  content: string
): Promise<ConfigFile> {
  const accessToken = await getAccessToken()

  // Get user ID from token
  const userResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
    }
  )

  if (!userResponse.ok) throw new Error('Failed to get user')
  const user = await userResponse.json()

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/config_files`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        user_id: user.id,
        name,
        content
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    console.error('Create error:', error)
    throw new Error(`Failed to create config file: ${error}`)
  }

  const text = await response.text()
  if (!text) {
    throw new Error('Empty response from server')
  }

  const data = JSON.parse(text)
  revalidatePath('/dashboard')
  return Array.isArray(data) ? data[0] : data
}

export async function updateConfigFile(
  id: string,
  name: string,
  content: string
): Promise<ConfigFile> {
  const accessToken = await getAccessToken()

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/config_files?id=eq.${id}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({ name, content, updated_at: new Date().toISOString() }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to update config file: ${error}`)
  }

  const text = await response.text()
  if (!text) {
    throw new Error('Empty response from server')
  }

  const data = JSON.parse(text)
  revalidatePath('/dashboard')
  return Array.isArray(data) ? data[0] : data
}

export async function deleteConfigFile(id: string): Promise<void> {
  const accessToken = await getAccessToken()

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/config_files?id=eq.${id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to delete config file: ${error}`)
  }
  revalidatePath('/dashboard')
}
