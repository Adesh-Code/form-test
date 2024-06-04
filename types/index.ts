
export interface RequestData {
    contents: RoleData[]
}

export enum Entities { user = 'user', model = 'model' };

export enum InputType { text = 'text', email = 'email', number = 'number', date = 'date', checkbox = 'checkbox', radio = 'radio'};

export interface RoleData {
    role: Entities,
    parts: TextData[]
}

export interface TextData {
    text: string;
}

export interface FormQuestionData {
    id: number,
    label: string,
    placeholder?: string,
    value: string,
    type?: InputType;
    min?: number;  
    max?: number;  
    options?: string[]; 
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