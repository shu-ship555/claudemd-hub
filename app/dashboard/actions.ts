'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { fetchSupabaseUser, getSupabaseAuthHeaders } from '@/lib/supabase-auth'

export interface ConfigFile {
  id: string
  user_id: string
  name: string
  content: string
  created_at: string
  updated_at: string
}

const CONFIG_FILES_URL = () =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/config_files`

async function getAccessToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get('sb-access-token')?.value
  if (!token) throw new Error('No access token')
  return token
}

function jsonHeaders(token: string, returnRepresentation = false) {
  return {
    ...getSupabaseAuthHeaders(token),
    'Content-Type': 'application/json',
    ...(returnRepresentation ? { Prefer: 'return=representation' } : {}),
  }
}

async function parseJsonResponse<T>(response: Response, errorMessage: string): Promise<T> {
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`${errorMessage}: ${error}`)
  }
  const text = await response.text()
  if (!text) throw new Error('Empty response from server')
  const data = JSON.parse(text)
  return Array.isArray(data) ? data[0] : data
}

export async function getConfigFiles(): Promise<ConfigFile[]> {
  const accessToken = await getAccessToken()
  const response = await fetch(
    `${CONFIG_FILES_URL()}?order=created_at.desc`,
    { headers: getSupabaseAuthHeaders(accessToken) }
  )
  if (!response.ok) throw new Error('Failed to fetch config files')
  return response.json()
}

export async function createConfigFile(
  name: string,
  content: string
): Promise<ConfigFile> {
  const accessToken = await getAccessToken()

  const user = await fetchSupabaseUser(accessToken)
  if (!user) throw new Error('Failed to get user')

  // 同名ファイルが存在する場合は連番サフィックスを付与
  const existingFiles = await getConfigFiles()
  const existingNames = new Set(existingFiles.map((f) => f.name))

  let uniqueName = name
  if (existingNames.has(name)) {
    const ext = name.includes('.') ? name.slice(name.lastIndexOf('.')) : ''
    const base = name.includes('.') ? name.slice(0, name.lastIndexOf('.')) : name
    let counter = 2
    while (existingNames.has(`${base} (${counter})${ext}`)) {
      counter++
    }
    uniqueName = `${base} (${counter})${ext}`
  }

  const response = await fetch(CONFIG_FILES_URL(), {
    method: 'POST',
    headers: jsonHeaders(accessToken, true),
    body: JSON.stringify({ user_id: user.id, name: uniqueName, content }),
  })

  const data = await parseJsonResponse<ConfigFile>(response, 'Failed to create config file')
  revalidatePath('/dashboard')
  return data
}

export async function updateConfigFile(
  id: string,
  name: string,
  content: string
): Promise<ConfigFile> {
  const accessToken = await getAccessToken()

  const response = await fetch(`${CONFIG_FILES_URL()}?id=eq.${id}`, {
    method: 'PATCH',
    headers: jsonHeaders(accessToken, true),
    body: JSON.stringify({ name, content, updated_at: new Date().toISOString() }),
  })

  const data = await parseJsonResponse<ConfigFile>(response, 'Failed to update config file')
  revalidatePath('/dashboard')
  return data
}

export async function deleteConfigFile(id: string): Promise<void> {
  const accessToken = await getAccessToken()

  const response = await fetch(`${CONFIG_FILES_URL()}?id=eq.${id}`, {
    method: 'DELETE',
    headers: getSupabaseAuthHeaders(accessToken),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to delete config file: ${error}`)
  }
  revalidatePath('/dashboard')
}
