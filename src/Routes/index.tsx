import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';

import Login from '../Features/UserLogin'
import Register from '../Features/UserRegister';
import DashBroad from '../Features/Dashbroad';
import ProtectedRouter from './ProtectedRouter'

// category pages
import AddCategory from '../component/Category/AddCategory';
import ListCategory from '../component/Category/ListCategory';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />

                <Route element={<ProtectedRouter />}>
                    <Route path='/' element={<DashBroad />} />
                    <Route path='/category/add' element={<AddCategory open={true} onClose={() => { }} />} />
                    <Route path='/category/list' element={<ListCategory />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}