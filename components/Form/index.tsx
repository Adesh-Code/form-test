'use client'
import { Entities, FormData, RequestData, RoleData, ServerFormData } from '@/types';
import Button from '@component-cloud-v1/button';
import Input from '@component-cloud-v1/input';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ThreeDots } from 'react-loader-spinner';
import * as prompts from '../../constants/prompt';

export interface FormProps { maxQuestions: number, context: string, keyTopics: string[] }

const Form = ({maxQuestions, context, keyTopics }: FormProps) => {
    if (maxQuestions < keyTopics.length){
        throw Error('Maximum questions should be greather than total topics');
    }
    const [formData, setFormData] = useState<FormData[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [loader, setLoader] = useState<boolean>(false);
    const [result, setResult] = useState<string|null>(null);

    const changePage = () => {
        setCurrentPage(currentPage + 1);
    }

    const handleClick = async () => {
        setLoader(true);
        if (formData.length < maxQuestions && loader === false) {

            const currentIndex = formData.findIndex((data) => data.id === currentPage);
            const prevFormInfo : RoleData[] = [];

            formData.map((formVal) => {
                prevFormInfo.push({
                    role: Entities.model,
                    parts: [
                        {
                            text: formVal.label,
                        }
                    ]
                });
                prevFormInfo.push({
                    role: Entities.user,
                    parts: [
                        {
                            text: formVal.value,
                        }
                    ]
                });
            });

            const content: RequestData = {
                contents: [
                    {
                        role: Entities.user,
                        parts: [
                            {
                                text: prompts.secondary_prompt({maxQuestions, context, topics: keyTopics})
                            }
                        ]
                    },
                    ...prevFormInfo,
                    
                ],
            };

            console.log(content);

            const data = await axios.post('http://localhost:3000/v1', content);
            const returnedData: ServerFormData = data.data;

            if (returnedData.candidates[0].content.parts[0].text.toString().includes('Questions complete, here is your JSON:')){
                setResult(returnedData.candidates[0].content.parts[0].text);
        setLoader(false);

        return;
            }

            const newQuestion: FormData = {
                id: currentIndex + 1,
                label: returnedData.candidates[0].content.parts[0].text.toString(),
                placeholder: returnedData.candidates[0].content.role,
                value: '',
            }

            setFormData([...formData, newQuestion]);
            changePage();

        }
        setLoader(false);
    }

    useEffect(() => {
        const getFirstQuestion = async () => {
            setLoader(true);
            const content: RequestData = {
                contents: [
                    {
                        role: Entities.user,
                        parts: [
                            {
                                text: prompts.secondary_prompt({maxQuestions, context, topics: keyTopics})
                            }
                        ]
                    }
                ],
            };
            const data = await axios.post('http://localhost:3000/v1', content);
            const returnedData = data.data;
            const newQuestion: FormData = {
                id: 0,
                label: returnedData.candidates[0].content.parts[0].text.toString(),
                placeholder: returnedData.candidates[0].content.role,
                value: '',
            }
            setFormData([newQuestion]);
            setLoader(false);
        }

        getFirstQuestion();
        console.log('done')
       
    }, [context, keyTopics, maxQuestions]);

    if (result) {
        return (
            <div>
                <h1>Thanks for the form here, is the result == {JSON.stringify(result, null, ' ')}</h1>
            </div>
        )
    }

    return (
        <>
            {
                formData.map((data) => {
                    if (data.id !== currentPage) return
                    return (
                        <div key={data.id}>
                            <h1>{data.id + 1}. {data.label}</h1>
                            <br />
                            <Input value={data.value} onChange={(e) => {
                                if (loader) return;
                                const newData = { ...data, value: e.currentTarget.value, };
                                if (currentPage === 0) {
                                    setFormData([newData]);
                                } else {
                                    setFormData([...formData.slice(0, currentPage), newData, ...formData.slice(currentPage + 1)]);
                                }
                            }}
                                placeholder={formData[currentPage].placeholder}
                            />
                        </div>
                    );
                })
            }
            <br />
            <ThreeDots
                visible={loader}
                height="80"
                width="80"
                color="#4fa94d"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
            <Button onClick={handleClick}>{currentPage === maxQuestions ? 'Submit' : 'Next'}</Button>
        </>
    )
}

export default Form