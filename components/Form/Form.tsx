'use client'
import { Entities, FormData, RequestData, ServerFormData } from '@/types';
import Button from '@component-cloud-v1/button';
import Input from '@component-cloud-v1/input';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import jsonFormData from './../../constants/data.json';
import { ThreeDots } from 'react-loader-spinner';
import * as prompts from './../../constants/prompt';

export interface FormProps { minQuestions: number, maxQuestions: number, prompt: string, keyTopics: string[] }

const Form = ({ minQuestions, maxQuestions, prompt, keyTopics }: FormProps) => {

    const [formData, setFormData] = useState<FormData[]>(jsonFormData);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [loader, setLoader] = useState<boolean>(false);
    const [result, setResult] = useState('');

    const changePage = () => {
        setCurrentPage(currentPage + 1);
    }

    const getFirstQuestion = async () => {
        setLoader(true);
        const content: RequestData = {
            contents: [
                {
                    role: Entities.user,
                    parts: [
                        {
                            text: prompts.main_prompt
                        }
                    ]
                },
                {
                    role: Entities.user,
                    parts: [
                        {
                            text: `${prompts.adminToAIPrefix} ${prompt}`
                        }
                    ]
                },
                {
                    role: Entities.user,
                    parts: [
                        {
                            text: prompts.topicPrompt({minQuestions, maxQuestions, topics : keyTopics})
                        }
                    ]
                }
            ],
        };
        const data = await axios.post('http://localhost:3000/v1', content);
        setLoader(false);

    }

    const handleClick = async () => {
        setLoader(true);
        if (formData.length < maxQuestions && loader === false) {

            const currentIndex = formData.findIndex((data) => data.id === currentPage);
            const content: RequestData = {
                contents: [
                    {
                        role: Entities.model,
                        parts: [
                            {
                                text: formData[currentIndex].label
                            }
                        ]
                    },
                    {
                        role: Entities.user,
                        parts: [
                            {
                                text: formData[currentIndex].value
                            }
                        ]
                    }
                ],
            };

            const data = await axios.post('http://localhost:3000/v1', content);
            const returnedData: ServerFormData = data.data;

            const newQuestion: FormData = {
                id: currentIndex + 1,
                label: returnedData.candidates[0].content.parts[0].text,
                placeholder: returnedData.candidates[0].content.role,
                value: '',
            }

            setFormData([...formData, newQuestion]);
            changePage();

        }
        setLoader(false);
    }

    useEffect(() => {
        getFirstQuestion();
    }, []);

    if (formData.length - 1 === maxQuestions) {
        return (
            <div>
                <h1>Thanks for the form here, is the result == {result}</h1>
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