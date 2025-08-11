export const storeToken = (token: string):void =>{
    if(typeof window !== 'undefined'){
        localStorage.setItem('token', token)
    }
}

export const getToken = (): string | null =>{
    if(typeof window !== 'undefined'){
        return localStorage.getItem('token')
    }
    return null
}

export const clearAuthData = (): void =>{
    if (typeof window !== 'undefined'){
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('auth')

        const keysToRemove = []
        for(let i = 0; i < localStorage.length; i++){
            const key = localStorage.key(i)

            if(key && (key.includes('auth') || key.includes('token') || key.includes('user'))){
                keysToRemove.push(key)
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key))
    }
} 

export const isAuthenticated =(): boolean =>{
    const token = getToken()
    return token !== null && token.length > 0
}

export const isValidateFormat =(token: string):boolean =>{
    const parts = token.split(' ')
    return parts.length === 3 && parts.every(part => part.length > 0)
}

export const getTokenExpiration = (token: string): Date | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp) {
      return new Date(payload.exp * 1000)
    }
  } catch (error) {
    console.error('Error parsing token payload:', error)
  }
  return null
}

export const isTokenExpired = (token: string): boolean => {
  const expiration = getTokenExpiration(token)
  if (!expiration) return false
  return new Date() > expiration
} 