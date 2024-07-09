import React from 'react';

const ProfileDropdown = () => {
    return (
        <ul className="navbar-nav flex-row align-items-center ms-auto">
            <li className="nav-item navbar-dropdown dropdown-user dropdown">
                <a className="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown">
                    <div className="avatar avatar-online">
                        <img src="/assets/img/avatars/1.png" alt className="w-px-40 h-auto rounded-circle" />
                    </div>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                        <a className="dropdown-item" href="#">
                            <div className="d-flex">
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar avatar-online">
                                        <img src="/assets/img/avatars/1.png" alt className="w-px-40 h-auto rounded-circle" />
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <span className="fw-medium d-block">John Doe</span>
                                    <small className="text-muted">Admin</small>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li>
                        <div className="dropdown-divider"></div>
                    </li>
                    <li>
                        <a className="dropdown-item" href="#">
                            <i className="bx bx-user me-2"></i>
                            <span className="align-middle">My Profile</span>
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="#">
                            <i className="bx bx-cog me-2"></i>
                            <span className="align-middle">Settings</span>
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="#">
                            <span className="d-flex align-items-center align-middle">
                                <i className="flex-shrink-0 bx bx-credit-card me-2"></i>
                                <span className="flex-grow-1 align-middle ms-1">Billing</span>
                                <span className="flex-shrink-0 badge badge-center rounded-pill bg-danger w-px-20 h-px-20">4</span>
                            </span>
                        </a>
                    </li>
                    <li>
                        <div className="dropdown-divider"></div>
                    </li>
                    <li>
                        <a className="dropdown-item" href="javascript:void(0);">
                            <i className="bx bx-power-off me-2"></i>
                            <span className="align-middle">Log Out</span>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    );
};

export default ProfileDropdown;
