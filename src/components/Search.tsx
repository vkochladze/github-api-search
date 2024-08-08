import { useState, useEffect } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

interface Repository {
    id: number;
    name: string;
    clone_url: string;
}

export default function Search() {

    const navigate = useNavigate();

    const [query, setQuery] = useState<string | null>(null);
    const [queryResult, setQueryResult] = useState<Repository[]>([]);
    const [searchParams, setSearchParams] = useSearchParams({ q: "" });
    const URLQueryParam = searchParams.get("q") || '';
    const debouncedSearchTerm = useDebounce(query || '', 300);

    const token = import.meta.env.VITE_API_KEY;
    const BASE_URL = 'https://api.github.com/search/repositories?q=';

    function handleChange(value: string) {
        setQuery(value);
    }

    useEffect(() => {
        const fetchRepos = async () => {
            // If input field is empty searchQuery = param from URL, otherwise searchQuery = value from input
            const searchQuery = query === null || query === '' ? URLQueryParam : debouncedSearchTerm;

            if (searchQuery) {
                const response = await fetch(`${BASE_URL}${searchQuery}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setQueryResult(data.items);
                setSearchParams(`q=${searchQuery}`);
                console.log(data.items);
            }
        };

        fetchRepos();
    }, [debouncedSearchTerm]); // 

    return (
        <Command className="rounded-lg border shadow-md w-1/5">
            <CommandInput placeholder="Type a git repository name..." onValueChange={handleChange} />

            <CommandList>
                {queryResult.map((repo) => (
                    <CommandItem key={repo.id} className='cursor-pointer' onSelect={() => navigate(`result/?repo=${repo.id}`)}>
                        {repo.name}
                    </CommandItem>
                ))}
            </CommandList>
        </Command>
    );
}