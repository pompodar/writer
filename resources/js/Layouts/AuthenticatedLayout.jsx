import { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import axios from 'axios';
import { Link, router } from '@inertiajs/react';

export default function Authenticated({ user, header, children }) {
    

    return (
        <>
            <div className="layout-wrapper layout-content-navbar">
                <div className="layout-container menu">
                    {children}
                </div>
            </div>

            <div className="layout-overlay layout-menu-toggle"></div>
        </>
    );
}
