"use client";

import { create } from "@/actions/create-board";
import { FormInput } from "./form-input";
import { FormButton } from "./form-button";
import { useFormState } from "react-dom";

export const Form = () => {
    const initialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(create, initialState);
    return (
        <form action={dispatch}>
            <div  className="flex flex-col space-y-2">
               <FormInput errors={state?.errors}/>
                </div>
               <FormButton/>
            </form>
    )
}