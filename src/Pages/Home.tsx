import Search from '@/components/Search'

export default function Home() {

    return (
        <>
            <h2 className='scroll-m-20 border-b pt-10 pb-5 text-3xl font-semibold tracking-tight first:mt-0'>GitHub Repo Search</h2>
            <Search />
        </>
    )
}