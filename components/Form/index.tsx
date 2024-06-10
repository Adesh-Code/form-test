'use client'
import { Entities, FormQuestionData, InputType, GeminiRequestData, GeminiRoleData } from '@/types';
import Button from '@component-cloud-v1/button';
import Input from '@component-cloud-v1/input';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ThreeDots } from 'react-loader-spinner';
import * as prompts from '../../constants/prompt';

export interface FormProps { maxQuestions: number, context: string, keyTopics: string[] }

let throatle = 2;

const Form = ({ maxQuestions, context, keyTopics }: FormProps) => {
    if (maxQuestions < keyTopics.length) {
        throw Error('Maximum questions should be greather than total topics');
    }
    const [formData, setFormData] = useState<FormQuestionData[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [loader, setLoader] = useState<boolean>(false);
    const [result, setResult] = useState<string | null>(null);

    const changePage = () => {
        setCurrentPage(currentPage + 1);
    }

    const getInputType = (name: string) => {
        switch (name) {
            case 'email':
                return InputType.email;
            case 'number':
                return InputType.number;
            case 'date':
                return InputType.date;
            case 'checkbox':
                return InputType.checkbox;
            case 'radio':
                return InputType.radio;
            default:
                return InputType.text;
        }
        return
    }

    const handleClick = async () => {
        if (formData.length < maxQuestions && loader === false) {

            const currentIndex= formData.findIndex((data) => data.id === currentPage);
            const prevFormInfo: GeminiRoleData[] = [];

            formData.map((formVal) => {
                prevFormInfo.push({
                    role: Entities.model,
                    parts: [
                        {
                            text: formVal.label!,
                        }
                    ]
                });
                prevFormInfo.push({
                    role: Entities.user,
                    parts: [
                        {
                            text: formVal.value!,
                        }
                    ]
                });
            });

            const content: GeminiRequestData = {
                contents: [
                    {
                        role: Entities.user,
                        parts: [
                            {
                                text: prompts.secondary_prompt({ maxQuestions, context, topics: keyTopics })
                            }
                        ]
                    },
                    ...prevFormInfo,

                ],
            };

            await handleApi(content, currentIndex + 1);
            changePage();
        }
    }

    const handleApi = async (content: any, id: number) => {
        console.log(throatle);
        if (throatle === 0) {
            console.log("Exceeded maximum question requests, please do again in some time");
            throatle = 2;
            setLoader(false);
            return;
        }
        throatle = throatle - 1;
        setLoader(true);
        console.log('handle apiasad \n');

        const data = await axios.post('http://localhost:3000/Gemini', content);

        if (data.status === 204) {
            console.log("Incorrect data format got")
            await new Promise(resolve => setTimeout(resolve, 2000));
            return await handleClick();
        }

        let returnedData = data.data;

        // end state
        if (data.status === 201) {
            setResult(returnedData.toString());
            setLoader(false);
            return;
        }

        const newQuestion: FormQuestionData = {
            id: id,
            label: returnedData.label,
            placeholder: returnedData.placeholder,
            value: '',
            max: returnedData.max,
            min: returnedData.min,
            options: returnedData.options,
            type: getInputType(returnedData.type)
        };


        throatle = 2;
        setFormData([...formData, newQuestion]);
        setLoader(false);
    }

    useEffect(() => {
        const getFirstQuestion = async () => {
            const content: GeminiRequestData = {
                contents: [
                    {
                        role: Entities.user,
                        parts: [
                            {
                                text: prompts.secondary_prompt({ maxQuestions, context, topics: keyTopics })
                            }
                        ]
                    }
                ],
            };
            await handleApi(content, 0);
        }

        
        getFirstQuestion();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context, keyTopics, maxQuestions]);



    if (result) {
        return (
            <div>
                <h1>Thanks for the form here, is the result == {JSON.stringify(result, null, ' ')}</h1>
            </div>
        )
    }

    if (throatle) {
        return (
            <div>
                Something went wrong...
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
                            <Input value={data.value!} onChange={(e) => {
                                if (loader) return;
                                const newData = { ...data, value: e.currentTarget.value, };
                                if (currentPage === 0) {
                                    setFormData([newData]);
                                } else {
                                    setFormData([...formData.slice(0, currentPage), newData, ...formData.slice(currentPage + 1)]);
                                }
                            }}
                                placeholder={formData[currentPage].placeholder ?? ''}
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