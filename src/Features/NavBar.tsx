import { House, PlusCircle, User2 } from 'lucide-react';
import type { TabType } from '../types/tab';
interface ITabs {
    name: string;
    icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & React.RefAttributes<SVGSVGElement>>;
    id: TabType;
}

const tabs: ITabs[] = [
    {
        name: "Trang chủ",
        icon: House,
        id: "home",
    },
    {
        name: "Thêm giao dịch",
        icon: PlusCircle,
        id: "add",
    },
    {
        name: "Đăng nhập",
        icon: User2,
        id: "login",
    }
]

interface IHeaderProps {
    tab: TabType;
    setTab: React.Dispatch<React.SetStateAction<TabType>>;
}
function NavBar({ tab, setTab }: IHeaderProps) {
    return (
        <div>
            <h1 className="text-2xl font-black tracking-wide text-center lg:text-left mb-8 bg-white/10 py-3 px-4 rounded-xl backdrop-blur-sm">
                Chi Tiêu Cá Nhân
            </h1>
            <nav className="space-y-2">
                {tabs.map(({ icon: Icon, id, name }) => {
                    return (
                        (<button key={id}
                            type="button"
                            onClick={() => setTab(id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${tab === id ? 'bg-white text-blue-600 shadow-lg' : 'hover:bg-white/10'}`}
                        >
                            <Icon></Icon>
                            <span>{name}</span>
                        </button>)
                    )
                })}
            </nav>
        </div>)
}
export default NavBar;