import React from 'react'
import AuthLayout from '@/modules/auth/components/AuthLayout'
import UserInfoForm from '@/modules/auth/components/UserInfoForm'

const UserInformation = () => {
  return (
    <AuthLayout>
      <UserInfoForm />
    </AuthLayout>
  )
}

export default UserInformation
