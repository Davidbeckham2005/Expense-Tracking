import { PlusCircle, Calendar, BarChart3, MoreHorizontal, LogOut } from 'lucide-react';
import type { TabType } from '../types/tab';
import { useAuth } from "../context/AuthContext";
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface ITabs {
    name: string;
    icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & React.RefAttributes<SVGSVGElement>>;
    id: TabType;
}

const tabs: ITabs[] = [
    { id: 'nhap-vao', name: 'Nhập vào', icon: PlusCircle },
    { id: 'lich', name: 'Lịch', icon: Calendar },
    { id: 'bao-cao', name: 'Báo cáo', icon: BarChart3 },
    { id: 'khac', name: 'Khác', icon: MoreHorizontal },
];

interface IHeaderProps {
    tab: TabType;
    setTab: React.Dispatch<React.SetStateAction<TabType>>;
}
export default function NavBar({ tab, setTab }: IHeaderProps) {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    const handleLogout = async () => {
        await logout();
        toast.success("Đăng xuất thành công");
        navigate('/login');
    }
    return (<div>
        <div className="flex flex-row items-center justify-center gap-6 bg-white backdrop-blur-md border border-theme-light/30 rounded-xl px-4 py-3">

            <nav className="flex flex-row items-center gap-2 flex-1 max-w-2xl">
                {tabs.map(({ icon: Icon, id, name }) => {
                    const isActive = tab === id;
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setTab(id)}
                            className={`flex-1 flex md:flex-col items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
                                    ${isActive
                                    ? 'bg-white text-theme'
                                    : 'text-black hover:text-theme/80'}`}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="hidden sm:inline">{name}</span>
                        </button>
                    );
                })}
            </nav>

            {isAuthenticated && (
                <div className="shrink-0">
                    <button
                        type='button'
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-red-600 text-red-400 hover:text-white px-4 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-red-600/20 active:scale-95 cursor-pointer"
                    >
                        <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                        <span className="hidden md:inline">Đăng Xuất</span>
                    </button>
                </div>
            )}

        </div>
    </div>
    );
}