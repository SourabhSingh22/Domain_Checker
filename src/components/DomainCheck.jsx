import React, { useState } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import Loading from './Loading';

const DomainCheck = () => {
    const [domain, setDomain] = useState('');
    const [loading, setLoading] = useState(false);
    const [availability, setAvailability] = useState(null);
    const [error, setError] = useState(null); 

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
                `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${
                    import.meta.env.VITE_WHOIS_API_KEY
                }&domainName=${domain.trim()}&outputFormat=JSON`
            );
            const data = await response.json();

            console.log("WHOIS Data:", data);

            const isAvailable =data?.WhoisRecord?.registrarName;

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
        <div className="flex h-full w-full flex-col">
            {/* Heading */}
            <div className="h-20 sm:w-full shadow-md text-center py-4 px-5 bg-gradient-to-l from-gray-50 to-neutral-100">
                <h1 className="text-4xl font-bold bg-gradient-to-b from-gray-950 inline-block text-transparent bg-clip-text text-shadow-2xs">
                    Domain Checker
                </h1>
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
                    className="bg-black py-4 px-3 sm:px-5 sm:py-4 text-white sm:text-lg text-[10px] rounded-full cursor-pointer hover:bg-gradient-to-r from-cyan-300 to-indigo-400 w-[35%] font-semibold sm:w-[20%] hover:text-black transition-all duration-300"
                >
                    {loading ? "Checking..." : "Search Domain"}
                </button>
            </div>

            {/* Output print available or not  */}
            <div className="mt-10 sm:mx-auto sm:w-4xl">
                {loading && <Loading />}
                {error && <p className="text-center text-red-500 text-lg">{error}</p>}
                {availability && (
                    <p className="text-center text-lg">{availability}</p>
                )}
            </div>
        </div>
    );
};

export default DomainCheck;
