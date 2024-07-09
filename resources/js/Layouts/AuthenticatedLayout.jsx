export default function Authenticated({ children }) {
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
