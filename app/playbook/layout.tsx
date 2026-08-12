export default function PlaybookLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-8 lg:flex-row">{children}</div>;
}
