import Search from '@/components/Search'
// import { Button } from '@/components/ui/button';
// import { useState } from 'react'

// interface resultArrayInfo {
//     id: number;
//     name: string;
//     clone_url: string;
// }

export default function Home() {

    // const [resultsArray, setResultsArray] = useState<resultArrayInfo[]>([]);

    // function handleRepoIntoArray(repos: resultArrayInfo[]) {
    //     const newObject = repos.map((repo) => (
    //         { id: repo.id, name: repo.name, clone_url: repo.clone_url }
    //     ));
    //     setResultsArray([...newObject]);
    // }
    // function handleRepoIntoArray(repos: resultArrayInfo[]) {
    //     console.log(repos);

    // }

    // const testArray = [
    //     { id: 1, name: 'test', clone_url: 'test' }
    // ]

    // console.log(resultsArray);

    return (
        <>
            <h2 className='scroll-m-20 border-b pt-10 pb-5 text-3xl font-semibold tracking-tight first:mt-0'>GitHub Repo Search</h2>
            {/* <Button onClick={() => handleRepoIntoArray(testArray)}>handleRepoIntoArray</Button> */}

            <Search />
        </>
    )
}