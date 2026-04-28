import Navbar from "./Navbar/Navbar";

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};

export default MainLayout;
