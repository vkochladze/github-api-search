import { useState, useEffect } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Button } from '@/components/ui/button';


interface Repository {
    id: number;
    name: string;
    clone_url: string;
    owner: string
}

export default function Result() {
    const navigate = useNavigate();

    const [queryResult, setQueryResult] = useState<Repository[]>([]);
    const [searchParams, setSearchParams] = useSearchParams({ repo: "" });
    const URLQueryParam = searchParams.get("repo");

    const token = import.meta.env.VITE_API_KEY;
    const BASE_URL = 'https://api.github.com/repositories/';

    useEffect(() => {
        const fetchRepos = async () => {
            const response = await fetch(`${BASE_URL}${URLQueryParam}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            setQueryResult(data);
            console.log(data);
        };

        console.log(URLQueryParam);

        fetchRepos();
    }, [URLQueryParam]); // 

    return (
        <>

            <div className='flex flex-row items-center content-center'>
                <Button className='mt-10 mb-5 mr-10 font-extrabold' onClick={() => navigate('/')}>&lt;</Button>
                <h2 className='scroll-m-20 border-b pt-10 pb-5 text-3xl font-semibold tracking-tight first:mt-0'>Repo: {queryResult.full_name}</h2>
            </div>

            {queryResult.owner &&
                <div>
                    <dl className="max-w-md text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                        <div className="flex flex-col py-3">
                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Owner:</dt>
                            <dd className="text-lg font-semibold">{queryResult.owner.login}</dd>
                        </div>
                        <div className="flex flex-col py-3">
                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Owner avatar:</dt>
                            <dd className="text-lg font-semibold"><img className='size-20' src={queryResult.owner.avatar_url} alt="" /></dd>
                        </div>
                        <div className="flex flex-col py-3">
                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">URL</dt>
                            <dd className="text-lg font-semibold"> <a href={queryResult.html_url}>{queryResult.html_url}</a></dd>
                        </div>
                        <div className="flex flex-col py-3">
                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Description:</dt>
                            <dd className="text-lg font-semibold">
                                {queryResult.description ? queryResult.description : <p className='font-mono text-gray-400'>No description provided</p>}
                            </dd>
                        </div>
                        <div className="flex flex-col py-3">
                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Created on:</dt>
                            <dd className="text-lg font-semibold">{queryResult.created_at}</dd>
                        </div>
                        <div className="flex flex-col py-3">
                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Language:</dt>
                            <dd className="text-lg font-semibold">{queryResult.updated_at}</dd>
                        </div>
                        <div className="flex flex-col py-3">
                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Last updated on:</dt>
                            <dd className="text-lg font-semibold">{queryResult.language}</dd>
                        </div>
                        <div className="flex flex-col py-3">
                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Open issues</dt>
                            <dd className="text-lg font-semibold">{queryResult.open_issues_count}</dd>
                        </div>
                    </dl>
                </div>
            }
        </>
    )
}