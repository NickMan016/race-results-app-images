export interface Driver{
    id: string
    image: string
}

export interface Team extends Driver{}
export interface Circuit extends Driver{}