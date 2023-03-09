import { FiArrowLeft } from "react-icons/fi"
import { RxCrossCircled, } from "react-icons/rx"
import { useState, ChangeEvent, useEffect, useRef, FormEvent } from "react"
import axios from "axios"
import { searchURl } from "../../constants/constants"
import { ofUserData } from "../../types"
import FoundedUser from "./FoundedUser"
import { toast } from 'react-toastify';
import Loader from "../loader/Loader"

const Search = ({ displayValue = false, goBack }: { displayValue: boolean, goBack: () => void }) => {
    const [searchText, setSearchText] = useState("")
    const [searchResult, setSearchResult] = useState<ofUserData[]>([])
    const [isSearched, setIsSearched] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const [innerWidth, setInnerWidth] = useState(window.innerWidth)
    const onChangeHandler = (event: ChangeEvent) => {
        setIsSearched(false)
        const { value } = event.target as HTMLInputElement
        setSearchText(value)
    }
    const crossHandler = () => {
        setSearchText("")
        inputRef.current?.focus()
    }
    useEffect(() => {
        inputRef.current?.focus()
    }, [displayValue])

    useEffect(() => {
        const handleInnerWidth = () => {
            setInnerWidth(window.innerWidth)
        }
        window.addEventListener("resize", handleInnerWidth)
        if (innerWidth < 700) {
            displayValue ? document.body.style.overflow = "hidden" : document.body.style.overflow = "auto"
        }
        return () => window.removeEventListener("resize", handleInnerWidth)
    }, [displayValue, innerWidth])

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
        <main className={`fixed left-0 w-[20%] sm:min-w-[280px] mediaWidth mediaMargin h-full z-10 bg-black text-white p-4 ${displayValue ? "" : "hidden"} border-r-2`}>
            <div className='flex items-center text-2xl bold gap-4'>
                <FiArrowLeft className='cursor-pointer text-gray-300 hover:text-white' onClick={goBack} />
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
                        onChange={onChangeHandler}
                    />
                    <RxCrossCircled
                        className='absolute top-3 right-2 text-black font-bold cursor-pointer'
                        onClick={crossHandler}
                    />
                </div>
            </form>
            {!isSearched && <div className="text-center">Search result will appear here</div>}
            {isSearching ? <Loader /> : searchData}
        </main>
    )
}

export default Search
