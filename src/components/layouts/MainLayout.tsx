import Header from "../layouts/Header/Header";
import Footer from "../layouts/Footer/Footer";
import { Outlet } from "react-router-dom";
import { useAppLocale } from "../../hooks/useAppLocale";

const MainLayout = () => {
  const { dir, textAlign } = useAppLocale();

  return (
    <div
      dir={dir}
      className={`flex min-h-screen w-full min-w-0 max-w-[100vw] flex-col overflow-x-hidden bg-white text-gray-900 ${textAlign}`}
    >
      <Header />

      <main className="w-full min-w-0 flex-1 overflow-x-hidden pb-0 pt-[4.75rem] sm:pt-[6.5rem]">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
