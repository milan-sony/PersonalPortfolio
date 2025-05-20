import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Index from '../pages/Index/Index'

function Router() {
    return (
        <Routes>
            <Route path='/' element={<Index />} />
        </Routes>
    )
}

export default Router