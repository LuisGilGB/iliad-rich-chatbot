
interface ChatLayoutProps {
  children: React.ReactNode
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="relative flex h-[calc(100vh-(--spacing(16)))] overflow-hidden">
      {/* <SidebarDesktop /> */}
      <div className="group w-full overflow-auto pl-0 animate-in duration-300 ease-in-out lg:peer-data-[state=open]:pl-[250px] xl:peer-data-[state=open]:pl-[300px]">
        {children}
      </div>
    </div>
  )
}
