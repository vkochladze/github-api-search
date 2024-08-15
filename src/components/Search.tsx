import { useState, useEffect, useContext } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { useSearchParams, Link } from 'react-router-dom';
import {
    Command,
    CommandInput,
    CommandList,
} from "@/components/ui/command"
import { useQuery } from '@tanstack/react-query';
// import { Button } from './ui/button';
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useNavigate } from 'react-router-dom';
import { Context } from '@/App';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './ui/table';
// import { Switch } from '@radix-ui/react-switch';
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function Search() {
    const navigate = useNavigate();
    const contextValue = useContext(Context);
    if (!contextValue) {
        throw new Error("Context value is undefined. Ensure the provider is wrapped around this component.");
    }
    const [query, setQuery] = contextValue;

    const [cardViewToggle, setCardViewToggle] = useState<boolean>(() => {
        {
            const savedView = localStorage.getItem('cardViewToggle');
            return savedView === 'true';
        }
    });
    const [searchParams, setSearchParams] = useSearchParams({ q: "" });
    const URLQueryParam = searchParams.get("q") || '';
    const debouncedSearchTerm = useDebounce(query || '', 300);

    const token = import.meta.env.VITE_API_KEY;
    const BASE_URL = 'https://api.github.com/search/repositories?q=';

    useEffect(() => {
        localStorage.setItem('cardViewToggle', String(cardViewToggle));
    }, [cardViewToggle]);

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
        queryKey: ['repos', debouncedSearchTerm, URLQueryParam],
        queryFn: fetchRepos,
        enabled: !!debouncedSearchTerm || !!URLQueryParam,
    })

    function switchView() {
        setCardViewToggle(prev => !prev)
    }

    const cardView = (
        <div className='grid grid-cols-4 gap-4 mt-5 mb-5 w-2/4'>
            {repos?.map((repo: { id: number; full_name: string; description: string; clone_url: string }) => (
                <Card key={repo.id} className='flex flex-col justify-between hover:scale-105 transition-all cursor-pointer' onClick={() => navigate(`result/?repo=${repo.id}`)} >
                    <CardHeader>
                        <CardTitle>{repo.full_name}</CardTitle>
                        <CardDescription>{repo.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className='flex justify-between'>
                        <Link to={repo.clone_url} target='_blank'><p className='text-sm text-sky-700 -foreground hover:text-sky-600'>{repo.clone_url}</p></Link>
                    </CardFooter>

                </Card>
            ))}
        </div>
    )

    const tabularView = (
        <div className='w-1/2 mt-8'>
            {!isLoading && repos.length > 0 && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead>Language</TableHead>
                            <TableHead className="text-right">Last Updated</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {repos?.map((repo: { id: number; full_name: string; description: string; clone_url: string; language: string; updated_at: string }) => {
                            const updated = repo.updated_at;
                            const dateWithoutTime = updated.split('T')[0];

                            return (
                                <TableRow key={repo.id} className='cursor-pointer' onClick={() => navigate(`result/?repo=${repo.id}`)}>
                                    <TableCell className="font-semibold">{repo.full_name}</TableCell>
                                    <TableCell>{repo.description}</TableCell>
                                    <Link to={repo.clone_url} target='_blank'>
                                        <TableCell className='text-sm text-sky-700 -foreground hover:text-sky-600'>{repo.clone_url}</TableCell>
                                    </Link>
                                    <TableCell>{repo.language}</TableCell>
                                    <TableCell className="text-right">{dateWithoutTime}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>

                </Table>
            )}
        </div>
    )

    // const listView = (
    //     <>
    //         {!isLoading && repos.length > 0 && (
    //             <Command className='rounded-lg border shadow-md w-1 /5'>
    //                 <CommandList className='p-1'>
    //                     <ul className='font-light text-[15px] tracking-wide'>
    //                         {repos?.map((repo: { id: number; name: string }) => (
    //                             <Link key={repo.id} to={`result/?repo=${repo.id}`}>
    //                                 <li className='cursor-pointer p-1 hover:bg-gray-100 relative flex items-center rounded-sm px-2 py-1.5' >
    //                                     {repo.name}
    //                                 </li>
    //                             </Link>
    //                         ))}
    //                     </ul>
    //                 </CommandList>
    //             </Command>
    //         )}

    //     </>
    // )

    return (
        <>

            <Command className='flex flex-row justify-between items-center rounded-lg border shadow-md w-1/5'>
                <CommandInput className='flex-grow px-2' placeholder={!URLQueryParam ? 'Type a github repository name...' : URLQueryParam} onValueChange={handleChange} />
                {/* <Button onClick={switchView} className='shadow-md w-1/5'>{cardViewToggle ? 'List View' : 'Card View'}</Button> */}
                <div className='flex items-center space-x-2 mr-3'>
                    <Checkbox id='switch-view' checked={cardViewToggle} onCheckedChange={switchView} />
                    <Label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70' htmlFor='switch-view'>Card View</Label>
                </div>

                <CommandList className='hidden'>
                </CommandList>
            </Command>


            {/* <div>
                <Switch className='p-5' checked={cardViewToggle} onCheckedChange={switchView} />
                <Label htmlFor='switch-view'>{cardViewToggle ? 'List View' : 'Card View'}</Label>
            </div> */}


            {isLoading && <p className='mt-5'>Loading search results...</p>}
            {URLQueryParam && !isLoading && repos.length === 0 && <p className='mt-5'>No results</p>}
            {cardViewToggle ? cardView : tabularView}

        </>
    );
}