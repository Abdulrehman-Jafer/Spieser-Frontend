import { useState, useEffect, useRef, FormEvent } from "react"
import axios from "axios"
import { FiArrowLeft } from "react-icons/fi"
import { RxCrossCircled, } from "react-icons/rx"
import { searchURl } from "../../constants/constants"
import { ofUserData } from "../../types"
import FoundedUser from "./FoundedUser"
import { toast } from 'react-toastify';
import Loader from "../loader/Loader"
import useClickOutside from "../../hooks/useClickOutside"

const Search = ({ displayValue = false, hideSearch }: { displayValue: boolean, hideSearch: () => void }) => {
    const [searchText, setSearchText] = useState("")
    const [searchResult, setSearchResult] = useState<ofUserData[]>([])
    const [isSearched, setIsSearched] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const searchRef = useRef<HTMLElement>(null)

    useEffect(() => {
        if (displayValue) {
            inputRef.current?.focus()
        }
        if (window.innerWidth < 700) {
            displayValue ? document.body.style.overflow = "hidden" : document.body.style.overflow = "auto"
        }
    }, [displayValue])
    const searchHandler = async (event: FormEvent) => {
        event.preventDefault()
        setIsSearching(true)
        await axios.post(searchURl, { searchText }).then(res => {
            toast.success(`Searched for ${searchText}`)
            setIsSearched(true)
            setIsSearching(false)
            setSearchResult(res.data.result)
        }).catch(err => {
            setIsSearching(false)
            toast.error("Something went wrong!")
            console.log(err)
        })
    }

    // useClickOutside(searchRef,hideSearch)
    const ResultMap = searchResult.map(({ username, userimage, _id }) => <FoundedUser key={_id} username={username} userimage={userimage} />)
    const searchData = !searchResult.length ?
        isSearched && <div className="flex justify-center flex-col items-center mt-10">
            <p>Not Found</p>
            <p>"{searchText}"</p>
        </div>
        :
        isSearched &&
        <div className="flex justify-center flex-col items-center mt-10">
            {ResultMap}
        </div>

    return (
        <main ref={searchRef} className={`fixed left-0 w-[20%] sm:min-w-[280px] mediaWidth mediaMargin h-full z-10 bg-black text-white p-4 ${displayValue ? "" : "hidden"} border-r-2`}>
            <div className='flex items-center text-2xl bold gap-4'>
                <FiArrowLeft className='cursor-pointer text-gray-300 hover:text-white' onClick={hideSearch} />
                <h1>Search</h1>
            </div>
            <form onSubmit={(event) => searchHandler(event)} className="border-b-2 py-[3rem]">
                <div className='relative'>
                    <input
                        ref={inputRef}
                        type="text"
                        className='w-[100%] p-2 bg-gray-500 text-white rounded-md'
                        placeholder='Search'
                        value={searchText}
                        onChange={(event) => {
                            setIsSearched(false)
                            setSearchText(event.target.value)
                        }}
                    />
                    <RxCrossCircled
                        className='absolute top-3 right-2 text-black font-bold cursor-pointer'
                        onClick={() => {
                            setSearchText("")
                            inputRef.current?.focus()
                        }}
                    />
                </div>
            </form>
            {!isSearched && <div className="text-center">Search result will appear here</div>}
            {isSearching ? <Loader /> : searchData}
        </main>
    )
}

export default Search
