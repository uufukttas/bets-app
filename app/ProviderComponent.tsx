'use client'

import { store } from '@/store'
import React from 'react'
import { Provider } from 'react-redux'

const ProviderComponent = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default ProviderComponent