import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import RequireAuth from './components/requireAuth';
import PersistLogin from './components/persistLogin';
import Chat from './pages/chat';
import SocialLogin from './pages/redirectSocialLogin';
import Call from './pages/call';
import InitComet from './components/initComet';
import AccountDetails from './pages/accountDetails';


export default function App(){
    return(
        <Routes>
            <Route path='/' element={<Layout/>}>
                {/* public routes */}
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/:type/:id/:username/:accessToken" element={<SocialLogin/>}/>
                <Route element={<PersistLogin/>}>
                    <Route element={<RequireAuth/>}>
                        <Route element={<InitComet/>}>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/chat/:cuid" element={<Chat/>}/>
                            <Route path='/call/:type/:cuid' element={<Call/>}/>
                            <Route path='/account' element={<AccountDetails/>}/>
                        </Route>
                    </Route>
                </Route>
            </Route>
        </Routes>
    )
}