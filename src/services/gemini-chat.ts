import {supabase} from '../lib/supabase'
import type { ICategory } from '../types/ICategories';
export async function test(question: string, categories: ICategory[]){
    const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: {
            message: question,
            categories: categories
        }
    })
    if (error) throw error;
  
    return data;
    
}