import { useState } from 'react'

export default function Input():JSX.Element {
    const [searchTerm, setSearchTerm] = useState(null)

    const handleChange = e => {
        setSearchTerm(e.target.value)
    }
    const handleSubmit = e => {
        
    }
    return (
        <div>
            <input onChange={handleChange} type="text"></input>
            <button onClick={handleSubmit}>Search</button>
        </div>
    )
}