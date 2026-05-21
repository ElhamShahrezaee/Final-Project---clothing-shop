import Header from "../layouts/Header/Header";
import Footer from "../layouts/Footer/Footer";
import { Outlet } from "react-router-dom";
import { useAppLocale } from "../../hooks/useAppLocale";

const MainLayout = () => {
  const { dir, textAlign } = useAppLocale();

  return (
    <div
      dir={dir}
      className={`flex min-h-screen flex-col bg-white text-gray-900 ${textAlign}`}
    >
      <Header />

      <main className="w-full flex-1 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
