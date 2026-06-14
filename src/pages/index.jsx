import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import FindPartners from "./FindPartners";

import Sessions from "./Sessions";

import Profile from "./Profile";

import Goals from "./Goals";

import Vocabulary from "./Vocabulary";

import Achievements from "./Achievements";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import Login from './Login';

const PAGES = {
    
    Dashboard: Dashboard,
    
    FindPartners: FindPartners,
    
    Sessions: Sessions,
    
    Profile: Profile,
    
    Goals: Goals,
    
    Vocabulary: Vocabulary,
    
    Achievements: Achievements,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    if (/\/login$/i.test(location.pathname)) {
        return <Routes><Route path="/login" element={<Login />} /><Route path="/Login" element={<Login />} /></Routes>;
    }

    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/FindPartners" element={<FindPartners />} />
                
                <Route path="/Sessions" element={<Sessions />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/Goals" element={<Goals />} />
                
                <Route path="/Vocabulary" element={<Vocabulary />} />
                
                <Route path="/Achievements" element={<Achievements />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}