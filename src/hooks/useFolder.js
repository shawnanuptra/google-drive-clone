import { doc, DocumentReference, getDoc } from "firebase/firestore"
import { useEffect } from "react"
import { useReducer } from "react"
import { database, firestore } from "../firebase"


//ACTIONS object - just to prevent typos
const ACTIONS = {
    SELECT_FOLDER: 'select-folder',
    UPDATE_FOLDER: 'update-folder'
}

//Root folder object
const ROOT_FOLDER = {
    name: 'Root', id: null, path: []
}

//reducer function for useReducer()
function reducer(state, { type, payload }) {
    switch (type) {
        //if user selects a folder other than 'Root', returns selected folder state
        case ACTIONS.SELECT_FOLDER:
            return {
                folderID: payload.folderID,
                folder: payload.folder,
                childFiles: [],
                childFolders: []
            }

        case ACTIONS.UPDATE_FOLDER:
            return {
                ...state,
                folder: payload.folder
            }
        default:
            return state;
    }
}

export function useFolder(folderID = null, folder = null) {
    
    //useReducer function
    const [state, dispatch] = useReducer(reducer,{
            folderID,
            folder,
            childFolders: [],
            childFiles: []
        })

    //triggered when user selects a folder
    useEffect(() => {
        dispatch({ type: ACTIONS.SELECT_FOLDER, payload: { folderID, folder } })
    }, [folderID, folder])

    //triggered when only folderID is changed e.g. when change pages
    useEffect( async () => {
        //'Root', where folderID is null
        if (folderID == null) {
            return dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: { folder: ROOT_FOLDER }
            })
        }

        //addFolder in current folder
        const docRef = doc(firestore, 'folders', folderID )
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            
            dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: { folder: database.formatDoc(docSnap) }
            })
        } else {
            dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: { folder: ROOT_FOLDER }
            })
        }


    }, [folderID])

    return state;
}