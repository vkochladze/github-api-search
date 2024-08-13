import { useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { useSearchParams, Link } from 'react-router-dom';
import {
    Command,
    CommandInput,
    CommandList,
} from "@/components/ui/command"
import { useQuery } from '@tanstack/react-query';
import { Button } from './ui/button';
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


export default function Search() {

    const [query, setQuery] = useState<string | null>(null);
    const [cardViewToggle, setCardViewToggle] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams({ q: "" });
    const URLQueryParam = searchParams.get("q") || '';
    const debouncedSearchTerm = useDebounce(query || '', 300);

    const token = import.meta.env.VITE_API_KEY;
    const BASE_URL = 'https://api.github.com/search/repositories?q=';

    function handleChange(value: string) {
        setQuery(value);
    }

    const fetchRepos = async () => {
        const searchQuery = query === null || query === '' ? URLQueryParam : debouncedSearchTerm;
        setSearchParams(`q=${searchQuery}`);

        if (searchQuery) {
            const response = await fetch(`${BASE_URL}${searchQuery}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data.items);
            return data.items || [];
        }
        return [];
    };

    const { data: repos = [], isLoading } = useQuery({
        queryKey: ['repos', debouncedSearchTerm],
        queryFn: fetchRepos,
        enabled: !!debouncedSearchTerm || !!URLQueryParam,
    })

    function switchView() {
        setCardViewToggle(prev => !prev)
    }

    const cardView = (
        <div className='grid grid-cols-4 gap-4 mt-5 w-2/4'>
            {repos?.map((repo: { id: number; full_name: string; description: string; clone_url: string }) => (
                <Card key={repo.id} className='flex flex-col justify-between'>
                    <CardHeader>
                        <CardTitle>{repo.full_name}</CardTitle>
                        <CardDescription>{repo.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className='flex justify-between'>
                        <a href={repo.clone_url}><p className='text-sm text-sky-600 -foreground'>{repo.clone_url}</p></a>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )

    const listView = (
        <>
            {!isLoading && repos.length > 0 && (
                <Command className='rounded-lg border shadow-md  w-1/5'>
                    <CommandList className='p-1'>
                        <ul className='font-light text-[15px] tracking-wide'>
                            {repos?.map((repo: { id: number; name: string }) => (
                                <Link key={repo.id} to={`result/?repo=${repo.id}`}>
                                    <li className='cursor-pointer p-1 hover:bg-gray-100 relative flex items-center rounded-sm px-2 py-1.5' >
                                        {repo.name}
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </CommandList>
                </Command>
            )}

        </>
    )

    return (
        <>
            <Command className='flex flex-row justify-between items-center rounded-lg border shadow-md w-1/5'>
                <CommandInput className='flex-grow px-2' placeholder="Type a github repository name..." onValueChange={handleChange} />
                <Button onClick={switchView} className='shadow-md w-1/5'>{cardViewToggle ? 'List View' : 'Card View'}</Button>
                <CommandList className='hidden'>
                </CommandList>
            </Command>

            {isLoading && <p className='mt-5'>Loading search results...</p>}
            {!isLoading && repos.length === 0 && <p className='mt-5'>No results</p>}
            {cardViewToggle ? cardView : listView}

        </>
    );
}