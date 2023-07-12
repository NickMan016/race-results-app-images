export interface Driver{
    id: string
    image: string
}

export interface TeamTemp extends Driver{
    miniImage: {
        light: string
        dark?: string
    }
    fullImage: {
        light: string
        dark?: string
    }
}

export interface UpdateTeamTemp extends Driver{
    miniImage?: {
        light?: string
        dark?: string
    }
    fullImage?: {
        light?: string
        dark?: string
    }
};

export type Team = Omit<TeamTemp, 'image'>
export type UpdateTeam = Omit<UpdateTeamTemp, 'image'>

export interface Circuit extends Driver{}