// components/Layout.tsx
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-200 p-4 text-center">
        © 2025 Your Website. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
