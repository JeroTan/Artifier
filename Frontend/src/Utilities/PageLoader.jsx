import Pageplate from "./Pageplate"

export default ()=>{
    return <Pageplate clean={true}>
        <main className="d-flex justify-content-center pt-5">
            <div className="d-flex align-items-center flex-wrap justify-content-center gap-3">
                <h2 role="status" className="fw-light text-center">Loading The Page</h2>
                <div className="spinner-border" aria-hidden="true"></div>
            </div>
        </main>
    </Pageplate>
}