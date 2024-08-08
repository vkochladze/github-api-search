import { useState, useEffect } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { useSearchParams } from 'react-router-dom';
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
// interface SearchInfo {
//     handleRepoIntoArray: (repos: { id: number, name: string, clone_url: string }[]) => void;
// }


export default function Search() {

    const [query, setQuery] = useState<string | undefined>(undefined);
    const [queryResult, setQueryResult] = useState<Repository[]>([]);
    const [searchParams, setSearchParams] = useSearchParams({ q: "" });
    const URLQueryParam = searchParams.get("q");
    const debouncedSearchTerm = useDebounce(query, 300)

    // const token = import.meta.env.VITE_API_KEY;
    const BASE_URL = 'https://api.github.com/search/repositories?q='

    function handleChange(value: string) {
        setQuery(value)
        setSearchParams(`q=${value}`);
    }

    useEffect(() => {
        const fetchRepos = async () => {
            // If input field is empty searchQuery = param from URL, otherwise searchQuery = value from input
            const searchQuery = query === undefined || query === '' ? URLQueryParam : debouncedSearchTerm;

            if (searchQuery) {
                setQuery(searchQuery);
                const response = await fetch(`${BASE_URL}${searchQuery}`);
                const data = await response.json();
                if (data.items) {
                    setQueryResult(data.items);
                } else {
                    setQueryResult([]);
                }
                // handleRepoIntoArray(data.items);
                console.log(data.items);

            }
        };

        fetchRepos();
    }, [debouncedSearchTerm, token, URLQueryParam, query]);

    return (
        <Command className="rounded-lg border shadow-md w-1/5">
            <CommandInput placeholder={query ? query : "Type a git repository name..."} onValueChange={handleChange} />

            <CommandList>
                {/* {queryResult && handleRepoIntoArray(queryResult)} */}

                {queryResult && queryResult.map((query) => {
                    return <a href={query.clone_url} key={query.id} target='blank'><CommandItem className='cursor-pointer' >{query.name}</CommandItem></a>
                })}
                {/* {queryResult && queryResult.map((query) => {
                    return <CommandItem key={query.id}><Link to={query.clone_url}>{query.name}</Link></CommandItem>
                })} */}
            </CommandList>
        </Command>
    )
}