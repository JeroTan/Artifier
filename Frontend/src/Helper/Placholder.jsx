import { randomizer } from "./Math";

export function InlineLoading(option){
    const Rows = option.rows;

    return <div className="">
        <p className="placeholder-glow">
        { [...Array(Rows)].map((x, i)=>{
            return <span key={i} className={`placeholder col-${randomizer(4,12)}`}></span>
        })}
        </p>
    </div>
}