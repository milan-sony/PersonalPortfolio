import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Index from '../pages/Index/Index'
import PageNotFound from '../pages/PageNotFound/PageNotFound'


function Router() {
    return (
        <Routes>
            <Route path='/' element={<Index />} />
            <Route path='*' element={<PageNotFound />} />
        </Routes>
    )
}

export default Router
