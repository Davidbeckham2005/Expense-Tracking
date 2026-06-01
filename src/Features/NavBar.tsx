import { PlusCircle, Calendar, BarChart3, MoreHorizontal, LogOut, Wallet } from 'lucide-react';
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
    { id: 'budget', name: 'Ngân sách', icon: Wallet },
    // { id: 'khac', name: 'Khác', icon: MoreHorizontal },
    // { id: 'category', name: 'Danh mục', icon: MoreHorizontal },
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
        <div className="flex flex-row items-center justify-center gap-3 md:gap-6 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl px-3 md:px-4 py-3 shadow-sm">

            <nav className="flex flex-row items-center gap-2 flex-1 max-w-2xl overflow-x-auto no-scrollbar">
                {tabs.map(({ icon: Icon, id, name }) => {
                    const isActive = tab === id;
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setTab(id)}
                            className={`flex-1 flex md:flex-col items-center justify-center gap-2 px-3 md:px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 min-w-24
                                    ${isActive
                                    ? 'bg-theme/10 text-theme ring-1 ring-theme/20'
                                    : 'text-slate-600 hover:text-theme/80 hover:bg-slate-50'}`}
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
                        className="flex items-center gap-2 bg-slate-100 hover:bg-rose-500 border border-slate-200 hover:border-rose-500 text-slate-600 hover:text-white px-3 md:px-4 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 active:scale-95 cursor-pointer"
                    >
                        <LogOut className="w-4 h-4 transition-transform" />
                        <span className="hidden md:inline">Đăng Xuất</span>
                    </button>
                </div>
            )}

        </div>
    </div>
    );
}