
export enum Entities { user = 'user', model = 'model', assistant = 'assistant', system = 'system' };

export enum InputType { text = 'text', email = 'email', number = 'number', date = 'date', checkbox = 'checkbox', radio = 'radio'};

export interface OpenAIRequestData {
    messages : OpenAIRoleData[]
}

export interface OpenAIRoleData {
    role: Entities,
    content: string
}

export interface GeminiRequestData {
    contents: GeminiRoleData[]
}

export interface GeminiRoleData {
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
