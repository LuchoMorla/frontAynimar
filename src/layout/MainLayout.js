import Header from "@components/Header";
import Nav from "@common/Nav";

export default function MainLayout({ children }) {
    return (
        <>
            <div className="min-h-[100dvh] flex flex-col">
                {/* <Header /> */}
                <main className="flex-1 flex flex-col">{/* 
            estos propiedades css nos provee tailwind
                 */}<div className="flex-1 flex flex-col">
                        {children}
                    </div>
                </main>
            </div>
        </>
    )
};