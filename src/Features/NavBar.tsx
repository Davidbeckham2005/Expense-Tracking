import { PlusCircle, Calendar, BarChart3, LogOut, Wallet, Settings } from 'lucide-react';
import type { TabType } from '../types/tab';
import { useAuth } from "../context/AuthContext";
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
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
    { id: 'setting', name: 'Cài đặt', icon: Settings },
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
    return (<div className="bg-card/60 backdrop-blur-sm border rounded-xl shadow-xs my-2">
        <div className="flex flex-row items-center justify-center gap-3 md:gap-6 px-3 md:px-4 py-3">

            <nav className="flex flex-row items-center gap-1 md:gap-2 flex-1 max-w-2xl xl:max-w-3xl 2xl:max-w-4xl overflow-x-auto no-scrollbar">
                {tabs.map(({ icon: Icon, id, name }) => {
                    const isActive = tab === id;
                    return (
                        <Button
                            key={id}
                            variant={isActive ? "default" : "ghost"}
                            onClick={() => setTab(id)}
                            className="flex-1 min-w-20 sm:min-w-24"
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="hidden sm:inline">{name}</span>
                        </Button>
                    );
                })}
            </nav>

            {isAuthenticated && (
                <div className="shrink-0">
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="text-muted-foreground hover:text-destructive hover:border-destructive"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden md:inline">Đăng Xuất</span>
                    </Button>
                </div>
            )}

        </div>
    </div>
    );
}
