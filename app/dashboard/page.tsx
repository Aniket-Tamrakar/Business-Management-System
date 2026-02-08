export default function DashboardPage() {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-zinc-500">Dashboard</span>
        <h1 className="text-2xl font-semibold text-zinc-900">
          Welcome to BMS
        </h1>
        <p className="text-sm text-zinc-500">
          Use the sidebar to open any module.
        </p>
      </div>
    </div>
  );
}

