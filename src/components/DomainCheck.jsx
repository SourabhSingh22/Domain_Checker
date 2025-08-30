import React, { useState } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import Loading from './Loading';

const DomainCheck = () => {
    const [domain, setDomain] = useState('');
    const [loading, setLoading] = useState(false);
    const [availability, setAvailability] = useState(null);
    const [error, setError] = useState(null);
    const [changeMode, setChangeMode] = useState(false)
    const [whoisData, setWhoisData] = useState(null);

    // for vaild domain name
    const domainRegex = /^(?!-)([A-Za-z0-9-]{1,63}\.)+[A-Za-z]{2,}$/;

    const checkDomain = async () => {
        setError(null);
        setAvailability(null);


        if (!domain.trim()) {
            setError("❌ Please enter a domain name.");
            return;
        }

        if (!domainRegex.test(domain.trim())) {
            setError("❌ Invalid domain format. Example: example.com");
            return;
        }


        setLoading(true);

        try {
            // fetch api store in response
            const response = await fetch(
                `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${import.meta.env.VITE_WHOIS_API_KEY
                }&domainName=${domain.trim()}&outputFormat=JSON`
            );
            const data = await response.json();

            console.log("WHOIS Data:", data);

            const isAvailable = data?.WhoisRecord?.registrarName;
            setWhoisData(data);

            if (isAvailable) {
                setAvailability("❌ Not Available");
            } else {
                setAvailability("✅ Domain Is available");
            }
        } catch (error) {
            console.error("Error fetching domain data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex h-[100vh] w-full flex-col ${changeMode ? 'bg-gray-900 text-white transition-all duration-300' : 'bg-white text-black transition-all  duration-300'}`}>
            {/* Heading */}
            <div className={`h-20 flex items-center justify-between sm:w-full shadow-md text-center py-4 sm:px-12 px-6  ${changeMode ? 'bg-gray-900 text-white border-b border-b-gray-50 ' : 'bg-gradient-to-l from-gray-50 to-neutral-200'}`}>
                <h1 className={`sm:text-4xl text-2xl font-bold  text-shadow-2xs ${changeMode ? 'bg-gradient-to-b from-white text-transparent bg-clip-text ' : "bg-gradient-to-b from-blue-900 text-transparent bg-clip-text"}`}>
                    Domain Checker
                </h1>

                <ul className='flex items-center gap-8 text-lg font-medium'>

                    <button onClick={() => setChangeMode(!changeMode)} className='text-4xl sm:text-3xl ml-12'>
                        {changeMode ? <MdLightMode className='cursor-pointer mr-4' />
                            : <MdDarkMode className='cursor-pointer mr-4' />
                        }
                    </button>

                    <li className='border hidden sm:block border-gray-400 cursor-pointer px-3 py-1 rounded-full hover:bg-blue-300 hover:text-white hover:transition-all duration-200'>About Us</li>
                    <li className='border hidden sm:block border-gray-400 cursor-pointer px-3 py-1 rounded-full hover:bg-blue-300 hover:text-white hover:transition-all duration-200'>Contact</li>
                    <li className='border hidden sm:block border-gray-400 cursor-pointer px-3 py-1 rounded-full hover:bg-blue-300 hover:text-white hover:transition-all duration-200'>Feedback</li>
                </ul>
            </div>

            {/* Input + Button */}
            <div className="mt-16 mx-4 sm:mx-auto sm:w-4xl border bg-gray-50 flex items-center justify-between pr-4 sm:pl-2 sm:py-2 rounded-full shadow-md border-white focus-within:border-neutral-900 text-black">
                <IoSearchOutline size={22} className="ml-5 text-neutral-500" />
                <input
                    type="text"
                    placeholder="Enter your domain (e.g., example.com)"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="pr-4 pl-1 sm:py-3 py-4 sm:w-[70%] border-0 outline-none rounded-full sm:text-lg placeholder:text-neutral-500 sm:placeholder:text-xl"
                />
                <button
                    onClick={checkDomain}
                    className="bg-black py-4 px-3 sm:px-5 sm:py-4 text-white sm:text-lg text-[10px] mr-[-4px] rounded-full cursor-pointer hover:bg-gradient-to-r from-cyan-300 to-indigo-400 w-[35%] font-semibold sm:w-[20%] hover:text-black transition-all duration-300"
                >
                    {loading ? "Checking..." : "Search Domain"}
                </button>
            </div>

            {/* Output print available or not  */}
            {error && (
                <div className={`my-12 flex flex-col px-6 justify-center mx-auto shadow-md rounded-md h-74 sm:w-xl ${changeMode ? 'bg-gray-50 text-black font-semibold ' : ""}`}>
                    <p className='text-center text-red-500 text-lg'>{error}</p>

                </div>
            )}

            {
                availability ? (
                    <div className={`sm:my-12 my-12 flex flex-col px-6 justify-center sm:mx-auto mx-4 shadow-md rounded-md h-74 sm:w-xl ${changeMode ? 'bg-gray-50 text-black font-semibold ' : ""}`}>

                        {availability && (
                            <div className='flex flex-col gap-6 flex-start my-2 sm:my-0 px-3 '>
                                <p className="text-xl font-semibold">{availability}</p>
                                <p className="text-lg"><span className='text-xl font-semibold'>Domain name:</span> {whoisData?.WhoisRecord?.domainName}</p>
                                <p className="text-lg"><span className='text-xl font-semibold'>RegistrarName:</span> {whoisData.WhoisRecord?.registrarName}</p>
                                <p className="text-lg"><span className='text-xl font-semibold'>Registrant country:</span> {whoisData?.WhoisRecord?.registrant?.country}</p>
                            </div>


                        )}
                    </div>
                ) : (
                    <div className={`my-12 flex flex-col px-6 justify-center  mx-auto rounded-md h-74 sm:w-xl`}>
                        {loading && <Loading />}
                    </div>
                )
            }

        </div>
    );
};

export default DomainCheck;
