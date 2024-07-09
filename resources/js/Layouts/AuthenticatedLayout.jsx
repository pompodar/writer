export default function Authenticated({ children }) {
    return (
        <>
            <div className="layout-wrapper layout-content-navbar">
                <div className="layout-container menu max-lg:flex max-lg:flex-col">
                    {children}
                </div>
            </div>
            <div className="layout-overlay layout-menu-toggle"></div>
        </>
    );
}
