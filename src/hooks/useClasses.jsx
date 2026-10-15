import React, { useEffect, useState } from 'react';

const useClasses = () => {

    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://edcare-seven.vercel.app/classes')
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                setClasses(data)
                setLoading(false);
            })
    }, [])
    return [classes, loading]
};

export default useClasses;