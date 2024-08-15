import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useContext } from 'react';
import { Context } from '@/App';

const loading = (
    <div>
        <div className="pt-10 flex flex-col space-y-3">
            <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[450px]" />
            </div>
        </div>
        <div className='pt-10 flex flex-col space-y-3'>
            <Skeleton className="h-4 w-[450px] " />
            <Skeleton className="h-20 w-20 rounded-full" />
        </div>
        <div className="pt-10 flex flex-col space-y-3">
            <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[450px]" />
            </div>
        </div>
        <div className="pt-10 flex flex-col space-y-3">
            <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[450px]" />
            </div>
        </div>
        <div className="pt-10 flex flex-col space-y-3">
            <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[450px]" />
            </div>
        </div>
        <div className="pt-10 flex flex-col space-y-3">
            <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[450px]" />
            </div>
        </div>
        <div className="pt-10 flex flex-col space-y-3">
            <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[450px]" />
            </div>
        </div>
        <div className="pt-10 flex flex-col space-y-3">
            <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[450px]" />
            </div>
        </div>
    </div>
)

export default function Result() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams({ repo: "" });
    const URLQueryParam = searchParams.get("repo");
    const contextValue = useContext(Context);
    if (!contextValue) {
        throw new Error("Context value is undefined. Ensure the provider is wrapped around this component.");
    }
    const [query] = contextValue;

    const token = import.meta.env.VITE_API_KEY;
    const BASE_URL = 'https://api.github.com/repositories/';


    const fetchRepoInfo = async () => {
        const response = await fetch(`${BASE_URL}${URLQueryParam}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log(data);
        return data;
    };

    const { data: repoInfo = [], isLoading } = useQuery({
        queryKey: ['repoInfo', URLQueryParam],
        queryFn: fetchRepoInfo,

    })

    if (isLoading) {
        return loading;
    }

    return (
        <>
            {repoInfo && repoInfo.owner &&
                <div>
                    <div className='flex flex-row items-center content-center border-b'>
                        <Button className='mt-10 mb-5 mr-10 pb-2 font-serif font-extrabold align-middle' onClick={() => navigate(`/?q=${query}`)}>&lt;</Button>

                        <h2 className='scroll-m-20  pt-10 pb-5 text-3xl font-semibold tracking-tight first:mt-0'>Repo: {repoInfo.full_name}</h2>
                    </div>

                    <dl className="max-w-md text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                        <div className="flex flex-col py-3">
                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Owner</dt>
                            <dd className="text-lg font-semibold">{repoInfo.owner.login}</dd>
                        </div>
                        <div className="flex flex-col py-3">
                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Owner avatar</dt>
                            <dd className="text-lg font-semibold"><img className='size-20' src={repoInfo.owner.avatar_url} alt="" /></dd>
                        </div>
                        <div className="flex flex-col py-3">
                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">URL</dt>
                            <dd className="text-lg font-semibold"> <a href={repoInfo.html_url}>{repoInfo.html_url}</a></dd>
                        </div>
                        <div className="flex flex-col py-3">
                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Description</dt>
                            <dd className="text-lg font-semibold">
                                {repoInfo.description ? repoInfo.description : <p className='font-mono text-gray-400'>No description provided</p>}
                            </dd>
                        </div>
                        <div className="flex flex-col py-3">
                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Created on</dt>
                            <dd className="text-lg font-semibold">{repoInfo.created_at}</dd>
                        </div>
                        <div className="flex flex-col py-3">
                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Last updated on</dt>
                            <dd className="text-lg font-semibold">{repoInfo.updated_at}</dd>
                        </div>
                        <div className="flex flex-col py-3">
                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Language</dt>
                            <dd className="text-lg font-semibold">{repoInfo.language}</dd>
                        </div>
                        <div className="flex flex-col py-3">
                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Open issues</dt>
                            <dd className="text-lg font-semibold">{repoInfo.open_issues_count}</dd>
                        </div>
                    </dl>
                </div>
            }
        </>
    )
}