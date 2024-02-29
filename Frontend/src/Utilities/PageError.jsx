import { Link } from "react-router-dom"

export default ()=>{
    return <main className="d-flex justify-content-center">
        <div className="text-center">
            <h3 className="mb-1">Something happened :o</h3>
            <small>Don't worry it's not your fault, perhaps go back to the <Link to="/" >Homepage</Link> pretend nothing happened.</small>
        </div>
    </main>
}