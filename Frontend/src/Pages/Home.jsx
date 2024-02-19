//HOOKS
import { useEffect, useState, useCallback, useMemo, useRef, useReducer, } from "react";
import { useNavigate } from "react-router-dom";

// Utilities

// Components
import Pageplate from "../Utilities/Pageplate";
import { Gallery } from "./Gallery/Main";

export default ()=>{
    return <Pageplate container={true}>
        <Gallery />
    </Pageplate>
}