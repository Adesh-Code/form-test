import { RequestData } from "@/types";
import axios from "axios";
import {AI_API} from './../../api';

export async function POST(request: Request) {
    try {
    const url = AI_API;
    const data : RequestData = await request.json();
    
    const responseData = await axios.post(url, data);
    return new Response(JSON.stringify(responseData.data));
    } catch (error) {
        console.log('error', error);
        return new Response( '', {status : 500} );
    }
    
}
 