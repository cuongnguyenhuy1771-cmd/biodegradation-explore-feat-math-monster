import React, { PropsWithChildren } from 'react'
import AuthScreenLayout from '@/modules/auth/components/AuthScreenLayout'

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <AuthScreenLayout background="splash" blur showBack>
      {children}
    </AuthScreenLayout>
  )
}

export default AuthLayout
