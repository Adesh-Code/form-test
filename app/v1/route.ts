import { RequestData, ServerFormData } from "@/types";
import axios from "axios";
import {AI_API} from './../../api';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
    const url = AI_API;
    const data : RequestData = await request.json();
    
    const responseData = await axios.post(url, data);
    const serverData = responseData.data as ServerFormData;

    let questionData = serverData.candidates[0].content.parts[0].text;

    const prefix = 'Question:';
    const responsePrefix = 'Questions complete, here is your JSON:';

    if (!questionData.includes(prefix)){
        if (!questionData.includes(responsePrefix)) {
            console.log(questionData);
            console.log('Not correct format getting new data')
            return new NextResponse( null, { status: 204});
        }
    }
    

    questionData = questionData.substring(questionData.indexOf('{'), questionData.lastIndexOf('}') + 1);

    const newData = JSON.parse(questionData.replace(/(\w+):/g, '"$1":').replace(/'/g, '"'));
    if (questionData.includes(responsePrefix)) {
        return new NextResponse(JSON.stringify(newData), {status: 201});
    }

    return new NextResponse(JSON.stringify(newData), {status: 200});
    } catch (error : any) {
        console.log('error', error?.message, error?.status);
        return new Response( '', {status : 500} );
    }
    
}
 