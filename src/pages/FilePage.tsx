import { useParams } from "react-router-dom";
import { EditFile } from "../components/editFile/EditFile";

export const FilePage = () => {
    const { fileId } = useParams();
    return (
        <>
            <EditFile fileId={fileId}/>
        </>
    );
};