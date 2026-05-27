import { icons } from '../constants/icon'
import { colors } from '../constants/color'
export type IconName = keyof typeof icons;
export type TColor = keyof typeof colors;
// => ép TypeScript hiểu rằng cat.icon chắc chắn là một key hợp lệ của icons
// cate[icon] = inconName 
// sau đó const Icon = icons["home"] => Icon sẽ là 1 component và có thể sử dụng
export interface ICategory {
    id: string;
    user_id: string;
    name: string;
    type: 'income' | 'expense';
    icon?: IconName;
    color?: TColor;
    create_at?: string;
    is_default: boolean;
    is_deleted: boolean;
}

export interface ICreateCategory {
    name: string;
    type: 'income' | 'expense';
    icon?: IconName;
    color?: TColor;
}

export interface IUpdateCategoryDto {
    name?: string;
    type?: 'income' | 'expense';
    icon?: IconName;
    color?: TColor;
}

export interface ICategoryFormData {
    name: string;
    type: 'income' | 'expense';
    icon?: IconName;
    color?: TColor;
}
export type TCategoryType = 'income' | 'expense';
