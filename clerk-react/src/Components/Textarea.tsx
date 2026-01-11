import {Textarea as UITextarea} from "./ui/textarea";

export default function Textarea({children}:{children?:React.ReactNode}) {
    return <UITextarea>{children}</UITextarea>;
}