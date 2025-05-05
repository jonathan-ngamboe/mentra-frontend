export type BaseResource = {
    id: number; 
    name: string;
    href: string;
}

export type ResourceType = {
    id: number; 
    typeName: string;
}

export type Resource = BaseResource & ResourceType;

export type RawResourceDbData = {
    id: number; 
    name: string | null;
    href: string | null;
    resource_type: {
        typeName: string | null;
    } | null; 
} | null; 