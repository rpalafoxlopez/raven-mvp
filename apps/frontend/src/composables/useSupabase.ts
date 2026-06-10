import { supabase } from '@/stores/authStore'

export const useSupabase = () => {
  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  }

  const uploadAvatar = async (file: File, userId: string) => {
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(`${userId}/${file.name}`, file, { upsert: true })
    if (error) throw error
    return data
  }

  return { getUser, getSession, uploadAvatar }
}
