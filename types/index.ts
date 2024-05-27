
export interface RequestData {
    contents: RoleData[]
}

export enum Entities { user = 'user', model = 'model' }

export interface RoleData {
    role: Entities,
    parts: TextData[]
}

export interface TextData {
    text: string
}

export interface FormData {
    id: number,
    label: string,
    placeholder: string,
    value: string,
}

export interface ServerFormData {
    candidates: ServerContentData[],
    usageMetadata: any
}

export interface ServerContentData {
    content: RoleData,
    finishReason: string,
	index: number,
    safetyRatings: any
}