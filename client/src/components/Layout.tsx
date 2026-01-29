import { Outlet } from 'react-router-dom';
import { ResizableNavbar } from './ResizableNavbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1220] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <ResizableNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
